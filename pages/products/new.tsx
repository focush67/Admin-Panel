import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
export default function NewProduct()
{
    return(<Layout>    
        <ProductForm id={""} existingTitle={""} existingDescription={""} existingPrice={""} head={"New Product"}/>
    </Layout>)
}