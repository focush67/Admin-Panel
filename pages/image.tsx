import React, { useState, useEffect } from "react";
import { storage } from "../models/FirebaseConfig";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { FaSpinner } from "react-icons/fa";
const MySwal = withReactContent(Swal);

export default function ImageTester({
  title,
}: {
  title: string;
}) {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const imageListRef = ref(storage, `${title}/`);

  useEffect(() => {
    setImageList([]);
    const seenUrls = new Set<string>();
    listAll(imageListRef).then((response: any) => {
      response.items.forEach((item: any) => {
        getDownloadURL(item).then((url) => {
          if (!seenUrls.has(url)) {
            seenUrls.add(url);
            setImageList((prev: any) => [...prev, url]);
          }
        });
      });
    });

    return () => {};
  }, [isUploading, isDeleting]);

  const uploadImage = () => {
    const name = imageUpload?.name;
    if (imageUpload === null || imageUpload === undefined) return;
    const imageRef = ref(storage, `${title}/${name + v4()}`);
    setIsUploading(true);
    uploadBytes(imageRef, imageUpload).then(() => {
      setIsUploading(false);
    });
  };

  const deleteImage = (url: string) => {
    MySwal.fire({
      icon: "question",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const fullPath = url.replace("https://storage.googleapis.com/", "");

        const imageRef = ref(storage, fullPath);
        setIsDeleting(true);
        deleteObject(imageRef)
          .then(() => {
            MySwal.fire("Deleted!", "The image has been deleted.", "success");
            setIsDeleting(false);
            setImageList((prevList) => prevList.filter((item) => item !== url));
          })
          .catch((err: any) => {
            console.error(err.message);
            MySwal.fire("Error", "An error occurred while deleting.", "error");
            setIsDeleting(false);
          });
      }
    });
  };

  return (
    <div>
      <input
        type="file"
        onChange={(event: any) => setImageUpload(event.target.files[0])}
        className="hover:cursor-pointer"
      />
      <button
        onClick={uploadImage}
        className="bg-gray-300 relative text-lg font-bold btn-primary"
      >
        Save
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
            <div
              key={url}
              className="flex-col p-1"
              style={{ width: "150px", height: "220px" }}
            >
              <div className="flex justify-center items-center h-[150px]">
                <img src={url} alt="image" className="max-w-full max-h-[150px]" />
              </div>
              <div className="flex mt-4 justify-center">
                <button
                  className="bg-red-900 text-white font-bold"
                  onClick={() => deleteImage(url)}
                >
                  {isDeleting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
