/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { storage } from "@/firebaseConfig";
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { v4 } from "uuid";

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

  const deleteImage = (url:string) => {
    const confirmDeletion = window.confirm("Sure wanna delete image ?");

    if(!confirmDeletion) return;
    
    const imageRef = ref(storage,url);

    deleteObject(imageRef).then(() => {
      alert("Image Deleted");
      setIsUploaded((prev) => !prev);
    }).catch((err:any) => {
      console.error(err.message);
    })
  }

  

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

      
        <div className="flex justify-center items-center mt-4">
  <div className="flex flex-wrap gap-2">
    {imageList.map((url) => (
      <div key={url} className="flex-col p-1" style={{ width: "150px", height: "220px" }}>
        <div className="flex justify-center items-center h-full">
          <img src={url} alt="image" className="max-w-full max-h-full rounded-lg" />
        </div>
        <div className="flex justify-center">
          <button className="hover:bg-red-800 hover:text-white" onClick={() => deleteImage(url)}>
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

      </div>
  );
}
