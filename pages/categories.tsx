/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/components/Layout";
import { DeleteButton } from "./products/delete/delButton";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import axios from "axios";


interface Property{
  name: string;
  value: string;
}

interface Category{
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/api/categories/").then((response: any) => {
          setCategories(response.data);
        });
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const saveCategory = async (event: any) => {
    try {
      event.preventDefault();
      const data = { name, parent,properties };
      if (editing) {
        await axios
          .put("/api/categories", {...data , _id : editing._id})
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
      console.log("Some error occured");
      console.log(error.message);
    } finally {
      setName("");
      setParent(null);
      setProperties([{
        name:"",
        value:"",
      }]);
    }
  };

  
  const parentCategories = categories.filter((category) => !category.parent);

  return (
    <Layout>
      <label className="font-bold ml-3">
        {editing !== null
          ? `Edit ${editing.name} Category`
          : "Add New Category"}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          className="mb-0"
          value={name}
          onChange={(e: any) => setName(e.target.value)}
        />
        <select
          className="mb-0"
          value={parent ? parent.toString() : ""}
          onChange={(e: any) => setParent(e.target.value)}
        >
          <option value="">No parent category</option>
          {parentCategories.map((category: any) => (
            <option
              key={category._id}
              value={category._id}
              className="hover:bg-blue-800"
            >
              {category.name}
            </option>
          ))}
        </select>

        <button className="border rounded-md px-1 m-2 mb-0 w-[20%] hover:bg-blue-900 hover:text-white justify-center">
          <div>Save</div>
        </button>
      </form>

      
      

      <div className="grid grid-cols-2 gap-4 mt-4">
        {parentCategories.map((parentCategory) => (
          <div
            key={parentCategory._id}
            className="border rounded p-4 bg-gray-100"
            style={{
              boxShadow:"0px 0px 5px 0px rgba(0,0,0,0.5)",
              padding:"10px",
            }}
          >
            <div className="flex gap-4">
              <h2 className="font-semibold">{parentCategory.name}</h2>
              <DeleteButton prodId={parentCategory._id} origin="categories" />
            </div>

            <ul className="mt-3">
              {categories
                .filter(
                  (category) => category.parent?._id === parentCategory._id
                )
                .map((subCategory) => (
                  <li
                    key={subCategory._id}
                    className="flex justify-between items-center pt-2"
                  >
                    {subCategory.name}
                    <div className="flex gap-2">
                      
                      <DeleteButton
                        prodId={subCategory._id}
                        origin="categories"
                      />
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
