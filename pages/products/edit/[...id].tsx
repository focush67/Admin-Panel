import Layout from "@/components/Layout";
import {useSearchParams} from 'next/navigation';
import {useEffect,useState} from 'react';
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage()
{
    const searchParams = useSearchParams();
    const prodId = searchParams;
    const [prod,setProd] = useState({
        id:"",
        existingTitle:"",
        existingDescription:"",
        existingPrice:"",
        head:"Edit Product"
    })
    useEffect(() => {
        axios.put(`/api/products?${prodId}`,prod).then(response => {
            console.log(response);
            setProd({
                id:response.data._id,
                existingTitle:response.data.title,
                existingDescription:response.data.description,
                existingPrice:response.data.price,
                head:"Edit Product",
            });
        })
    },[prodId])

    return(
        <Layout>
            <ProductForm {...prod}/>
        </Layout>
    )
}