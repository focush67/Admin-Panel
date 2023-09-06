/* eslint-disable react/jsx-key */
import Layout from "@/components/Layout";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { DeleteButton } from "./products/delete/delButton";
const Products = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try{
        axios.get("/api/products").then((response) => {
      setProducts(response.data);
    });
      } catch(error:any)
      {
        console.log(error.message);
      }
    }

    fetchData();
    const interval = setInterval(fetchData,5000);
    return () => {
      clearInterval(interval);
    }
  }, []);

  
  
  return (
    <Layout>
      <Link
        href={"/products/new"}
        className="bg-blue-900 text-white font-bold py-2 px-2 mx-3 my-2 rounded-md"
      >
        Add New Products
      </Link>

      <table className="basic mt-2">
        <thead>
          <tr>
            <td className="font-bold">Product Name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {products.map((product: object) => (
            <tr>
              <td>{product.title}</td>
              <td>
                <Link href={'/products/edit/'+ product._id}
                 >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </Link>
                <DeleteButton prodId = {product._id} origin="products"/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Products;
