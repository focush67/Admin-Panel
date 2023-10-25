import React, { useState } from "react";
import { categoryStorage } from "../models/FirebaseConfig";
import {
  ref,
  uploadBytes,
} from "firebase/storage";
import { v4 } from "uuid";

export default function CategoryUpload({
  title,
}: {
  title: string;
}) {
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = () => {
    const name = imageUpload?.name;
    if (imageUpload === null || imageUpload === undefined) return;
    const imageRef = ref(categoryStorage, `${title}/${name + v4()}`);
    console.log(imageRef);
    setIsUploading(true);
    uploadBytes(imageRef, imageUpload).then(() => {
      setIsUploading(false);
    });
  };


  return (
      <div className="flex">
      <input
        type="file"
        onChange={(event: any) => setImageUpload(event.target.files[0])}
        className="hover:cursor-pointer bg-none"
      />
      <button
        onClick={uploadImage}
        className="bg-gray-300 relative text-lg font-bold hover:text-white hover:bg-blue-900"
      >
        <div className="text-center p-1">Save</div>
      </button>
    </div>
  );
}
