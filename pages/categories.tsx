/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/components/Layout";
import { DeleteButton } from "./products/delete/delButton";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryUpload from "./imageCategory";
import { Category } from "@/models/CategorySchema";
import ImageList from "./ImageListRefsCat";
import { useSession } from "next-auth/react";

interface Property {
  name: string;
  value: string;
}

interface Category {
  creator: string;
  _id: string;
  name: string;
  parent: {
    _id: string;
  } | null;
  properties: Property[];
}

const Categories = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      name: "",
      value: "",
    },
  ]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [parent, setParent] = useState<mongoose.Types.ObjectId | null>(null);
  const { data: session } = useSession();
  const [productsByCategory, setProductsByCategory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/categories/?creator=${session?.user?.email}`);
        setCategories(response.data);
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [session]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData: Record<string, any[]> = {};

        for (const category of categories) {
          const response = await axios.get(`/api/categories/?creator=${session?.user?.email}&parentCategory=${category._id}`);
          const products = response.data;
          productsData[category._id] = products;
        }

        setProductsByCategory(productsData);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 3000);
    return () => {
      clearInterval(interval);
    };
  }, [categories, session]);

  const saveCategory = async (event: any) => {
    try {
      event.preventDefault();
      const creator = session?.user?.email;
      const data = { creator, name, parent, properties };
      if (editing) {
        await axios
          .put("/api/categories", { ...data, _id: editing._id })
          .then((response: any) => {
            console.log(response);
          });

        setEditing(null);
      } else {
        await axios
          .post("/api/categories/", data)
          .then((response: any) => {
            console.log(response);
          })
          .catch((err: any) => {
            console.log(err.message);
          });
      }
    } catch (error: any) {
      console.log("Some error occurred");
      console.log(error.message);
    } finally {
      setName("");
      setParent(null);
      setProperties([
        {
          name: "",
          value: "",
        },
      ]);
    }
  };

  const parentCategories = categories.filter((category) => !category.parent);

  return (
    <Layout>
      <div className="flex items-center">
        <label className="font-bold ml-3">
          {editing !== null
            ? `Edit ${editing.name} Category`
            : "New"}
        </label>
        <form onSubmit={saveCategory} className="flex gap-1">
          <input
            type="text"
            className="mb-0 w-[50%]"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
          />
          <CategoryUpload title={name} />
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {parentCategories.map((parentCategory) => (
          <div
            key={parentCategory._id}
            className="border rounded p-4 bg-gray-100"
            style={{
              boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.5)",
              padding: "10px",
            }}
          >
            <div className="flex gap-1 justify-start items-center overflow-hidden">
              <p className="font-bold">{parentCategory.name.toUpperCase()}</p>
              <DeleteButton prodId={parentCategory._id} origin="categories" />
            </div>

            <ImageList title={parentCategory.name} />

            <ul className="mt-3">
              {productsByCategory[parentCategory._id]?.map((product) => (
                <li
                  key={product._id}
                  className="flex justify-between items-center pt-2"
                >
                  {product.title}
                  <div className="flex gap-2">
                    <DeleteButton prodId={product._id} origin="products" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Categories;
