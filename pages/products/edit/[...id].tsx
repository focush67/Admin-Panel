import { useEffect,useState } from "react";
import axios from "axios";
import Layout from "@/components/Layout";
import EditForm from "@/components/EditForm";
import { useSearchParams } from "next/navigation";
export default function EditProductPage() {
  const searchParams = useSearchParams();
  const prodId = searchParams;
  const [prod, setProd] = useState({
    existingTitle: "",
    existingDescription: "",
    existingPrice: "",
    exisitingImagesFolder: "",
  });

  useEffect(() => {
    axios.get(`/api/products?${prodId}`).then((response) => {
      setProd({
        existingTitle: response.data.title,
        existingDescription: response.data.description,
        existingPrice: response.data.price,
        existingImagesFolder: response.data.imagesFolder,
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
