import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import ImageTester from "@/pages/image";
import mongoose from "mongoose";

export interface Property{
  name: string;
  value: string;
}
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
  existingCategory: mongoose.Types.ObjectId | null;
  existingProperties: Property[],
}) {
  const productId = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState(existingTitle || "T");
  const [description, setDescription] = useState(existingDescription || "D");
  const [price, setPrice] = useState(existingPrice || "0");
  const [imagesFolder, setImagesFolder] = useState(existingImagesFolder);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState<mongoose.Types.ObjectId | null>(
    existingCategory || null
  );
  const [properties, setProperties] = useState<Property[]>(
    existingProperties || [
      {
        name: "",
        value: "",
      },
    ]
  );

  const handleSubmitEdit = async (e: any) => {
    setImagesFolder(title);
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      imagesFolder,
      category,
      properties,
    };

    await axios
      .put(`/api/products/?${productId}`, data)
      .then((response: any) => console.log(response.data))
      .catch((error: any) => console.log(error.message));

    try {
      const name = title;
      const parent = category;

      const categoryData = { name, parent, properties };

      await axios
        .put(`/api/categories/?${productId}`, categoryData)
        .then((response: any) => console.log(response))
        .catch((err: any) => console.log(err.message));

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

  const parentCategories:Property[] = categories.filter((cat: any) => !cat.parent);

  useEffect(() => {
    axios.get(`/api/products/?${productId}`).then((response: any) => {
      const data = response.data;
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price);
      setImagesFolder(data.imagesFolder);
      setLoading(false);
      setCategory(data.category);
      setProperties(data.properties);
    });
  }, [productId]);

  const handlePropertyChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: "name" | "value") => {
    const newProperties:Property[] = [...properties];
    newProperties[index][field] = e.target.value;
    setProperties(newProperties);
  };

  const handleAddProperty = () => {
    setProperties([...properties, { name: "", value: "" }]);
    console.log(properties);
  };

  const handleRemoveProperty = async (e:any , index:number) => {
    const newProperties = [...properties];
    newProperties.splice(index,1);
    setProperties(newProperties);

    try {
      const updatedData = {
        title,description,price,imagesFolder,category,properties:newProperties,
      };

      await axios.put(`/api/products/?${productId}`,updatedData);
    } catch (error:any) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FaSpinner className="animate-spin text-blue-500 text-5xl" />
      </div>
    );
  }

  return (
    <div>
      <form
      onSubmit={handleSubmitEdit}
      className="bg-gray-200 overflow-hidden relative p-1 min-h-screen"
    >
      <div className="flex justify-center">
        <h1 className="text-blue-900 mb-3 font-bold text-xl">Edit Product</h1>
      </div>

      <label htmlFor="" className="text-black font-bold">
        <h1>Product Name</h1>
        <input
          type="text"
          name="Name"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
          className="font-normal"
        />
      </label>

      <label className="font-bold text-black">
        <h1>Category</h1>
        <select
          value={category ? category.toString() : ""}
          onChange={(e: any) => setCategory(new mongoose.Types.ObjectId(e.target.value))}
        >
          {parentCategories.map((category: any) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="" className="text-black font-bold ">
        <h1>Description</h1>
        <textarea
          name="Description"
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          className="font-normal"
        ></textarea>
      </label>

      <label htmlFor="" className="font-bold text-black">
        {properties.map((property, index) => (
          <div key={index} className="flex gap-1">
            <input
              type="text"
              value={property.name}
              onChange={(e) => handlePropertyChange(e, index, "name")}
            />

            <input
              type="text"
              value={property.value}
              onChange={(e) => handlePropertyChange(e, index, "value")}
            />
            {
              index > 0 && (
                  <button className="border-rounded-md px-1 m-2 mb-0 w-[46%] hover:bg-red-900 hover:text-white justify-center" onClick={(e) => handleRemoveProperty(e,index)}>Remove Property</button>
                )
            }
            {index === properties.length - 1 && (
              <button
                className="border rounded-md px-1 m-2 mb-0 w-[20%] hover:bg-blue-900 hover:text-white justify-center"
                onClick={handleAddProperty}
              >
                <div>Add Property</div>
              </button>
            )}
          </div>
        ))}
      </label>

      <label htmlFor="" className="font-bold text-black">
        <h1>Price (INR)</h1>
        <input
          type="text"
          name="Price"
          value={price}
          onChange={(e: any) => setPrice(e.target.value)}
          className="font-normal"
        />
      </label>

      <label htmlFor="" className="font-bold text-black">
        <h1>Photos</h1>
      </label>
      <div>
        <ImageTester title={title} />
      </div>
    </form>
    </div>
  );
}
