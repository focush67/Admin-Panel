/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from "react";
import { storage } from "@/firebaseConfig";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { FaSpinner } from "react-icons/fa";
export default function imageTester({
  title,
  page,
}: {
  title: string;
  page: string;
}) {
  const [imageUpload, setImageUpload] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
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
  }, [isUploading, isDeleting]);

  const uploadImage = () => {
    const name = imageUpload?.name;
    if (imageUpload === null) return;
    console.log(name);
    const imageRef = ref(storage, `${title}/${name + v4()}`);
    setIsUploading(true);
    uploadBytes(imageRef, imageUpload).then(() => {
      alert("Image Uploaded");
      console.log("Image Uploaded");
      setIsUploading(false);
    });
  };

  const deleteImage = (url: string) => {
    const confirmDeletion = window.confirm("Sure wanna delete image ?");

    if (!confirmDeletion) return;

    const imageRef = ref(storage, url);
    setIsDeleting(true);
    deleteObject(imageRef)
      .then(() => {
        alert("Image Deleted");
        setIsDeleting(false);
      })
      .catch((err: any) => {
        console.error(err.message);
        setIsDeleting(false);
      });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => setImageUpload(event.target.files[0])}
        className=""
      />
      <button
        onClick={uploadImage}
        className=" bg-gray-300 relative text-lg font-bold btn-primary"
      >
        Upload
      </button>

      <div className="flex mt-4">
        {imageList.length === 0 ? (
          isUploading || isDeleting ? (
            <div className="flex justify-center items-center w-full h-32">
              <FaSpinner className="text-4xl animate-spin" />
            </div>
          ) : (
            <p>No images available.</p>
          )
        ) : (
          imageList.map((url) => (
            <div key={url} className="flex-col p-1" style={{ width: "150px", height: "220px" }}>
              <div className="flex justify-center items-center h-full">
                <img src={url} alt="image" className="max-w-full max-h-full" />
              </div>
              <div className="flex justify-center mt-2">
                <button
                  className="hover:bg-red-800 hover:text-white"
                  onClick={() => deleteImage(url)}
                  disabled={isDeleting}
                >
                  {isDeleting ? <FaSpinner className="animate-spin" /> : "Delete"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
