import { useState, useEffect } from "react";
import useRouter from "next/router";
import axios from "axios";

export default function ProductForm({
  title:existingTitle,description:existingDescription,price:existingPrice}:any) {
  const [title, setTitle] = useState(existingTitle || "Product Name");
  const [description, setDescription] = useState(existingDescription|| "Description");
  const [price, setPrice] = useState(existingPrice || "Price");
  
  const [redirectProd, setRedirectProd] = useState(false);
  const router = useRouter;
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const data = { title, description, price };
    const res = await axios.post("/api/products", data);
    setRedirectProd(true);
  };

  if (redirectProd) {
    router.push("/products");
    return;
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-blue-900 mb-3 font-bold text-xl">New Product</h1>
      <label htmlFor="">
        Product Name
        <input
          type="text"
          
          placeholder={existingTitle}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label htmlFor="">
        Description
        <textarea
          name="Description"
          placeholder={existingDescription}
          
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </label>

      <label htmlFor="">
        Price
        <input
          type="text"
          placeholder={existingPrice}
          className="flex w-12"
          
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>

      <button className="btn-primary">Save</button>
    </form>
  );
}
