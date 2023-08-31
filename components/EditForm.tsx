import { useState,useEffect } from "react";
import {FaSpinner} from 'react-icons/fa';
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ImageTester from "@/pages/image";
export default function EditForm({
    existingTitle,
    existingDescription,
    existingPrice,
    existingCategory,
    existingImagesFolder,
}:{
    existingTitle:string;
    existingDescription:string;
    existingPrice:string;
    existingCategory:string;
    existingImagesFolder:string;
})

{
    const productId = useSearchParams();
    const [loading,setLoading] = useState(true);
    const [title,setTitle] = useState(existingTitle || "T");
    const [description,setDescription] = useState(existingDescription || "D");
    const[price,setPrice] = useState(existingPrice || "0");
    const[imagesFolder,setImagesFolder] = useState(existingImagesFolder);
    const [category,setCategory] = useState(existingCategory || null);
    const [categories,setCategories] = useState([]);

    const handleSubmitEdit = async (e:any) => {
        setImagesFolder(title);
        e.preventDefault();
        const data = {title,description,price,imagesFolder,category};
        
        alert(title+","+description+","+price+","+imagesFolder+","+category);

        const response = await axios.put("/api/products",data);
        console.log(response);

        try{
            const categoryData = {
                name:title,
                parent:category,
                _id:productId.get('id'),
            }

            const response = await axios.put("/api/categories",categoryData);

            console.log(response);
        }catch(error:any){
            console.log(error.message);
        }
        
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try{
                axios.get("/api/categories").then((response:any) => setCategories(response.data));
            }catch(error:any)
            {
                console.log(error.message);
            }
        }

        fetchCategories();
    },[]);

    const parentCategories = categories?.filter((cat:any) => !cat.parent);

    useEffect(() => {
        axios.get(`/api/products?${productId}`).then((response) => {
            const data = response.data;
            setTitle(data.title);
            setDescription(data.description);
            setPrice(data.price);
            setImagesFolder(data.imagesFolder);
            setCategory(data.category);
            setLoading(false);
        })
    },[productId]);

    if(loading)
    {
        return (
            <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
      </div>
        )
    }

    
    return (
        <form onSubmit={handleSubmitEdit} className="bg-gray-200 overflow-hidden relative p-1 min-h-screen">
            <h1 className="text-blue-900 mb-3 font-bold text-xl">Edit Product</h1>

            <label htmlFor="" className="text-black font-bold">
                Product Name
                <input type="text" name="Name" value={title} onChange={(e:any) => setTitle(e.target.value)} className="font-normal"/>
            </label>

            <label className="font-bold text-black">
                Category
                <select
                value={category}
                onChange={(e:any) => setCategory(e.target.value)}>
                    <option value="">None</option>
                    {
                        parentCategories.map((category:String) => (
                            <option value={category._id} key={category._id}>{category.name}</option>
                        ))
                    }
                </select>
            </label>

            

            <label htmlFor="" className="text-black font-bold">
                Description
                <textarea name="Description" value={description} onChange={(e:any) => setDescription(e.target.value)} className="font-normal"></textarea>
            </label>

            <label htmlFor="" className="font-bold text-black">
                Price (USD)
                <input type="text" name="Price" value={price} onChange={(e:any) => setPrice(e.target.value)} className="font-normal"/>
            </label>

            {/* <label htmlFor="" className="font-bold text-black">
                Photos
            </label>
            <div>
                 <ImageTester title={title} page="Edit"/>
            </div> */}

            <button className="btn-primary">Save</button>
        </form>
    )
}