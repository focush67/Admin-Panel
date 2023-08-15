/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { storage } from "@/firebaseConfig";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
export default function imageTester({title}:{title:string}) {
  const [imageUpload, setImageUpload] = useState<File>();
  const [isUploaded,setIsUploaded] = useState(false);
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, `${title}/`);


  useEffect(() => {
    listAll(imageListRef).then((response: any) => {
      response.items.forEach((item: any) => {
        getDownloadURL(item).then((url) => {
          setImageList((prev: any) => [...prev, url]);
        });
      });
    });
  }, [isUploaded]);


  const uploadImage = () => {
    const name = imageUpload?.name;
    if (imageUpload === null) return;
    console.log(name);
    const imageRef = ref(storage, `${title}/${name + v4()}`);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image Uploaded");
      setIsUploaded(true);
    });
  };

  

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => setImageUpload(event.target.files[0])}
      />
      <button onClick={uploadImage} className="btn-primary">
        Upload
      </button>

      <div className="w-32 h-auto flex flex-row gap-3 m-3 justify-between">
        {imageList.map((url) => {
          return <img src={url} alt="image" />;
        })}
      </div>
    </div>
  );
}
