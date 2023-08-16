import { useState,useEffect } from "react";
import {FaSpinner} from 'react-icons/fa';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ImageTester from "@/pages/image";
export default function EditForm({
    existingTitle,
    existingDescription,
    existingPrice,
    existingImagesFolder,
}:{
    existingTitle:string;
    existingDescription:string;
    existingPrice:string;
    existingImagesFolder:string;
})

{
    const productId = useSearchParams();
    const [loading,setLoading] = useState(true);
    const [title,setTitle] = useState(existingTitle || "T");
    const [description,setDescription] = useState(existingDescription || "D");
    const[price,setPrice] = useState(existingPrice || "0");
    const[imagesFolder,setImagesFolder] = useState(existingImagesFolder);

    useEffect(() => {
        axios.get(`/api/products?${productId}`).then((response) => {
            const data = response.data;
            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price);
            setImagesFolder(data.imagesFolder);
            setLoading(false);
        })
    },[productId]);

    if(loading)
    {
        return (
            <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
        )
    }

    const handleSubmitEdit = async (e:any) => {
        setImagesFolder(title);
        e.preventDefault();
        const data = {title,description,price,imagesFolder};
        alert(title+","+description+","+price+","+imagesFolder);

        if(productId)
        {
            await axios.put(`/api/products?${productId}`,data);
        }

        else
        {
            alert("Product doesn't exist");
        }
    };


    return (
        <form onSubmit={handleSubmitEdit} className="bg-gray-200 overflow-hidden relative p-1">
            <h1 className="text-blue-900 mb-3 font-bold text-xl">Edit Product</h1>

            <label htmlFor="">
                Product Name
                <input type="text" name="Name" value={title} onChange={(e:any) => setTitle(e.target.value)}/>
            </label>

            <label htmlFor="">
                Description
                <input type="text" name="Description" value={description} onChange={(e:any) => setDescription(e.target.value)}/>
            </label>

            <label htmlFor="">
                Price
                <input type="text" name="Price" value={price} onChange={(e:any) => setPrice(e.target.value)}/>
            </label>

            <label htmlFor="">
                Photos
            </label>
            <div>
                <ImageTester title={title}/>
            </div>
        </form>
    )
}