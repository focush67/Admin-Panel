import { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import mongoose from "mongoose";
import ImageTester from "@/pages/image";
import { useRouter } from "next/navigation";
export default function NewForm() {
  const router = useRouter();
  const [properties, setProperties] = useState([
    {
      name: "",
      value: "",
    },
  ]);
  const [loading,setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<mongoose.Types.ObjectId | null>(
    null
  );

  const handleSubmitNew = async (e: any) => {
    const imagesFolder = title;
    e.preventDefault();
    const data = { title, description, price, imagesFolder, category , properties};
    alert(
      "Product Name : " +
        title +
        "\n" +
        "Description : " +
        description +
        "\n" +
        "Price : " +
        price +
        "\n" +
        "Images Folder : " +
        imagesFolder +
        "\n" +
        "Parent ID : " +
        category +
        "\n"
    );
    const response = await axios.post("/api/products", data);
    console.log(response);

    try {
      const name = title;
      const parent = category;
      const categoryData = { name, parent , properties};
      await axios
        .post("/api/categories", categoryData)
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error.message));

    } catch (error: any) {
      console.log("Some error occured");
      console.log(error.message);
    } finally{
        setProperties([{
            name:"",
            value:"",
        }])

        router.push("/products");
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        axios
          .get("/api/categories")
          .then((response: any) => {
            setCategories(response.data)
            setLoading(false)});
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchCategories();
  }, []);

  const parentCategories = categories.filter((cat: any) => !cat.parent);

  const handlePropertyChange = (e: any, index: number, field: any) => {
    const newProperties = [...properties];
    newProperties[index][field] = e.target.value;
    setProperties(newProperties);
  };

  const handleAddProperty = () => {
    setProperties([...properties, { name: "", value: "" }]);

    console.log(properties);
  };

  const handleRemoveProperty = (e:any,index:number) => {
    const temp = [...properties];
    temp.splice(index,1);
    setProperties(temp);
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
      onSubmit={handleSubmitNew}
      className="bg-gray-200 overflow-hidden relative p-1 min-h-screen"
    >
      <div className="flex justify-center">
        <h1 className="text-blue-900 mb-3 font-bold text-xl">New Product</h1>
      </div>

      <label htmlFor="" className="font-bold">
        <h1>Product Name</h1>
        <input
          type="text"
          name="Name"
          placeholder="Name"
          required
          onChange={(e: any) => setTitle(e.target.value)}
          className="font-normal"
        />
      </label>

      <label className="font-bold">
        <h1>Category</h1>
        <select
          value={category}
          onChange={(e: any) => setCategory(e.target.value)}
        >
          <option value="">None</option>
          {parentCategories.map((category: String) => (
            <option value={category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label htmlFor="" className="font-bold">
        <h1>Description</h1>
        <textarea
          name="Description"
          id=""
          value={description}
          onChange={(e: any) => setDescription(e.target.value)}
          className="font-normal"
          placeholder="About"
        ></textarea>
      </label>

      <label htmlFor="" className="font-bold text-black">
        {properties.map((property, index) => (
          <div key={index} className="flex gap-1">
            <input
              type="text"
              placeholder="Property Name"
              value={property.name}
              onChange={(e) => handlePropertyChange(e, index, "name")}
            />
            <input
              type="text"
              placeholder="Property Value"
              value={property.value}
              onChange={(e) => handlePropertyChange(e, index, "value")}
            />
            
              {
                index > 0 && (
                  <button className="border-rounded-md px-1 m-2 mb-0 w-[46%] hover:bg-red-900 hover:text-white justify-center" onClick={(e) => handleRemoveProperty(e,index)}>Remove Property</button>
                )
              }
                
              
            
            

            {index === properties.length - 1 && (
              <div className="flex gap-2 justify-between">
                <button
                className="border rounded-md px-1 py-1 m-2 mb-0 w-auto hover:bg-blue-900 hover:text-white justify-center"
                onClick={handleAddProperty}
              >
                <div>Add Property</div>
              </button>

              
              </div>
              
            )}

            
          </div>
        ))}
      </label>

      <label htmlFor="" className="text-black font-bold">
       <h1>Price</h1>
        <input
          type="text"
          name="Price"
          placeholder="0"
          required
          onChange={(e: any) => setPrice(e.target.value)}
          className="font-normal"
        />
      </label>

      <label htmlFor="" className="text-black font-bold">
        <h1>Photos</h1>
      </label>
      <div>
        <ImageTester title={title} page="New" />
      </div>

    </form>
  );
}
