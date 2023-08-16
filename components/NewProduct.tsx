import { useState,useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import {ref} from 'firebase/storage';
import { storage } from "@/firebaseConfig";
import ImageTester from "@/pages/image";
export default function NewForm()
{
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const[price,setPrice] = useState("");
    const handleSubmitNew = async (e:any) => {
        const imagesFolder = title;
        e.preventDefault();
        const data = {title,description,price,imagesFolder};
        alert(title+","+description+","+price+","+imagesFolder);
        const response = await axios.post("/api/products",data);
        console.log(response);
    }


    return (
        <form onSubmit={handleSubmitNew} className="bg-gray-200 overflow-hidden relative p-1">
            <h1 className="text-blue-900 mb-3 font-bold text-xl">New Product</h1>

            <label htmlFor="">
                Product Name
                <input type="text" name="Name" placeholder="Name" required onChange={(e:any) => setTitle(e.target.value)}/>
            </label>

            <label htmlFor="">
                Description
                <textarea name="Description" id="" value={description} onChange={(e:any) => setDescription(e.target.value)}></textarea>
            </label>

            <label htmlFor="">
                Price
                <input type="text" name="Price" placeholder="0" required onChange={(e:any) => setPrice(e.target.value)}/>
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