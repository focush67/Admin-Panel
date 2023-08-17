/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { storage } from "@/firebaseConfig";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { FaSpinner } from "react-icons/fa";
export default function imageTester({title,page}:{title:string;
page:string;}) {
  const [imageUpload, setImageUpload] = useState<File>();
  const [isUploaded,setIsUploaded] = useState(false);
  const [imageList, setImageList] = useState([]);
  const imageListRef = ref(storage, `${title}/`);


  useEffect(() => {
    setImageList([]);
    listAll(imageListRef).then((response: any) => {
      response.items.forEach((item: any) => {
        getDownloadURL(item).then((url) => {
          console.log(url);
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
      console.log("Image Uploaded");
      setIsUploaded(true);
    });
  };

  

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => setImageUpload(event.target.files[0])}
        className=""
      />
      <button onClick={uploadImage} className=" bg-gray-300 relative text-lg font-bold btn-primary">
        Upload
      </button>

      <div className="gap-2 rounded-lg justify-center mt-3 flex flex-col text-center font-semibold">
       
        <div className="flex gap-2">
        {imageList.map((url) => {
          // eslint-disable-next-line react/jsx-key
          return <img src={url} alt="image" className="rounded-lg w-32 h-auto"/>;
        })}
        </div>
      </div>
    </div>
  );
}
