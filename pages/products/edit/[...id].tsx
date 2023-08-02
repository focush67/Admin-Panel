import Layout from "@/components/Layout";
import { useSearchParams} from "next/navigation";
import { useEffect, useState } from "react";
import axios from 'axios';
import ProductForm from "@/components/ProductForm";
export default function EditProductPage() {
  const searchParams = useSearchParams();
  const[product,setProduct] = useState({
    id:"",
    title:"",
    description:"",
    price:"",
  }); 
  const id = searchParams;

  useEffect(() => {
    axios.get(`/api/products?${id}`).then(response => {
       setProduct({
        title: response.data.title,
        description: response.data.description,
        price: response.data.price,
      });

      
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[id]);
  return(
    <Layout> 
        <ProductForm head={"Edit Product"} {...product}/>   
    </Layout>
  )
}
