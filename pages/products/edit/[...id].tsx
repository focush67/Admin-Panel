import { useEffect,useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import EditForm from "@/components/EditForm";
import { useSearchParams } from "next/navigation";
import mongoose from "mongoose";
export default function EditProductPage() {
  const searchParams = useSearchParams();
  const prodId = searchParams;
  const [prod, setProd] = useState({
    existingTitle: "",
    existingDescription: "",
    existingPrice: "",
    exisitingImagesFolder: "",
    exisitingCategory:null,
  });

  useEffect(() => {
    axios.get(`/api/products?${prodId}`).then((response) => {
      setProd({
        existingTitle: response.data.title,
        existingDescription: response.data.description,
        existingPrice: response.data.price,
        existingImagesFolder: response.data.imagesFolder,
        exisitingCategory:response.data.category,
      });
    });
  }, [prodId]);

  useEffect(() => {
  }, [prod]); // This watches for changes in the prod state

  return (
    <Layout>
      <EditForm {...prod} />
    </Layout>
  );
}
