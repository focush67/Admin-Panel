import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ImageTester from "@/pages/image";
import mongoose from "mongoose";
export default function EditForm({
  existingTitle,
  existingDescription,
  existingPrice,
  existingImagesFolder,
  existingCategory,
  existingProperties,
}: {
  existingTitle: string;
  existingDescription: string;
  existingPrice: string;
  existingImagesFolder: string;
  existingCategory: mongoose.Types.ObjectId;
  existingProperties : [{
    name:String,
    value:String,
  }]
}) {
  const productId = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(existingTitle || "T");
  const [description, setDescription] = useState(existingDescription || "D");
  const [price, setPrice] = useState(existingPrice || "0");
  const [imagesFolder, setImagesFolder] = useState(existingImagesFolder);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState<mongoose.Types.ObjectId | null>(existingCategory || null);
  const [properties,setProperties] = useState(existingProperties || [{
    name:"",
    value:"",
  }]);

  const handleSubmitEdit = async (e: any) => {
    setImagesFolder(title);
    e.preventDefault();
    const data = { title, description, price, imagesFolder, category,properties };
    
    await axios.put(`/api/products/?${productId}`,data).then((response:any) => console.log(response.data)).catch((error:any) => console.log(error.message));

    try {
      const name = title;
      const parent = category;
      const _id = productId.get("id");

      const categoryData = { name, parent, _id ,properties};
      alert("Product Name : "+categoryData.name+"\n"+"Parent ID : "+parent+"\n"+"Product ID : "+_id);

      await axios
        .put("/api/categories", categoryData)
        .then((response: any) => console.log(response))
        .catch((err: any) => console.log(err.message));

        router.push("/products");
    } catch (error: any) {
      console.log("Some error occured");
      console.log(error.message);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        axios
          .get("/api/categories")
          .then((response: any) => setCategories(response.data));
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = categories.filter((cat: any) => !cat.parent);
  

  useEffect(() => {
    axios.get(`/api/products?${productId}`).then((response:any) => {
      const data = response.data;
      console.log(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setImagesFolder(data.imagesFolder);
      setLoading(false);
      setCategory(data.category);
      setProperties(data.properties);
    });
  }, [productId]);

  const handlePropertyChange = (e:any , index : any , field : any) => {
    const newProperties = [...properties];
    newProperties[index][field] = e.target.value;
    setProperties(newProperties);
  }

  const handleAddProperty = () => {
    setProperties([...properties , {name:"",value:""}]);
    console.log(properties);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmitEdit}
      className="bg-gray-200 overflow-hidden relative p-1 min-h-screen"
    >
      <h1 className="text-blue-900 mb-3 font-bold text-xl">Edit Product</h1>

      <label htmlFor="" className="text-black font-bold">
        Product Name
        <input
          type="text"
          name="Name"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          className="font-normal"
        />
      </label>

      <label className="font-semibold text-black">
        Category
        <select
          value={category}
          onChange={(e: any) => setCategory(e.target.value)}
        >
          <option value="">None</option>
          {parentCategories.map((category: String) => (
            <option value={category._id} key={category._id}
            >
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="" className="text-black font-bold">
        Description
        <textarea
          name="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          className="font-normal"
        ></textarea>
      </label>

      <label htmlFor="" className="font-bold text-black">
        {
          properties.map((property,index) => (
            <div key={index} className="flex gap-1">
              <input type="text"
              value={property.name}
              onChange={(e)=>handlePropertyChange(e,index,"name")}
               />

               <input type="text" 
               value={property.value}
               onChange={(e)=>handlePropertyChange(e,index,"value")}/>

               {
                index === properties.length-1 && (
                  <button className="border rounded-md px-1 m-2 mb-0 w-[20%] hover:bg-blue-900 hover:text-white justify-center" onClick={handleAddProperty}>
                    <div>Add Property</div>
                  </button>
                )
               }
            </div>
          ))
        }
      </label>

      <label htmlFor="" className="font-bold text-black">
        Price (USD)
        <input
          type="text"
          name="Price"
          value={price}
          onChange={(e: any) => setPrice(e.target.value)}
          className="font-normal"
        />
      </label>

      {/* <label htmlFor="" className="font-bold text-black">
                Photos
            </label>
            <div>
                 <ImageTester title={title} page="Edit"/>
            </div> */}

            <button className="btn-primary">Save</button>
      
    </form>
  );
}
