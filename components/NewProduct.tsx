import { useState } from "react";
import axios from "axios";
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
        <form onSubmit={handleSubmitNew} className="bg-gray-200 overflow-hidden relative p-1 min-h-screen">
            <h1 className="text-blue-900 mb-3 font-bold text-xl">New Product</h1>
            
            <label htmlFor="" className="font-bold text-black">
                Product Name
                <input type="text" name="Name" placeholder="Name" required onChange={(e:any) => setTitle(e.target.value)} className="font-normal"/>
            </label>

            <label htmlFor="" className="font-bold text-black">
                Description
                <textarea name="Description" id="" value={description} onChange={(e:any) => setDescription(e.target.value)} className="font-normal"></textarea>
            </label>

            <label htmlFor="" className="text-black font-bold">
                Price (USD)
                <input type="text" name="Price" placeholder="0" required onChange={(e:any) => setPrice(e.target.value)} className="font-normal"/>
            </label>

            <label htmlFor="">
                Photos
            </label>
            <div>
                <ImageTester title={title} page="New"/> 
            </div>
        </form>
    )
}