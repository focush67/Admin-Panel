import { useState } from "react";
import useRouter from "next/router";
import axios from "axios";
export default function ProductForm({
  id,
  head,
  existingTitle,
  existingDescription,
  existingPrice}:{id:string;existingTitle:string;existingDescription:string;existingPrice:string;head:string;}) {
  
  const [title, setTitle] = useState(existingTitle || "Product");
  const [description, setDescription] = useState(existingDescription|| "Description");
  const [price, setPrice] = useState(existingPrice || "Price");
  const [redirectProd, setRedirectProd] = useState(false);
  const router = useRouter;
  const productId = id;
  const handleSubmitNew = async (e: any) => {
    e.preventDefault();
    const data = { title, description, price };
    const res = await axios.post("/api/products", data);
    console.log(res);
    setRedirectProd(true);
  };

  if (redirectProd) {
    router.push("/products");
    return;
  }

  const handleSubmitEdit = async(e:any) => {
    e.preventDefault();
    const data = {title,description,price};
    console.log(productId);
    if(productId)
    {
      await axios.put(`/api/products?${productId}`,data);
    }

    else{
      alert("Product doesn't exist");
    }

    setRedirectProd(true);
  }

  return (
    <form onSubmit={head === "New Product" ? handleSubmitNew : handleSubmitEdit}>
       <h1 className="text-blue-900 mb-3 font-bold text-xl">{head}</h1> 
      <label htmlFor="">
        Product Name
        <input
          type="text"
          name="Name"
          placeholder={existingTitle}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label htmlFor="">
        Description
        <textarea
          name="Description"
          
          placeholder={existingDescription}
          onChange={e => setDescription(e.target.value)}
        ></textarea>
      </label>

      <label htmlFor="">
        Price
        <input
          type="text"
          placeholder={existingPrice}
          className="flex w-12"
          name="Price"
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>

      <button className="btn-primary">Save</button>
    </form>
  );
}
