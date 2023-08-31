/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/components/Layout";
import { DeleteButton } from "./products/delete/delButton";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";
import axios from "axios";

const categories = () => {
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState<mongoose.Types.ObjectId | null>(initialParent || null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await axios.get("/api/categories").then((response: any) => {
          setCategories(response.data);
        });
      } catch (error: any) {
        console.error(error.message);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const saveCategory = async (event: any) => {
    try {
      event.preventDefault();
      const data = { name, parent };
      if (editing) {
        await axios
          .put("/api/categories", { ...data, _id: editing._id })
          .then((response: any) => {
            console.log(response);
          });

        setEditing(null);
      } else {
        await axios
          .post("/api/categories", data)
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
    }
  };

  const editCategory = async (category: Object) => {
    console.log("editing");
    setEditing(category);
    setName(category.name);
    setParent(category.parent?._id);
  };

  const parentCategories = categories.filter((category) => !category.parent);
  
  return (
    <Layout>
      <label className="font-bold ml-3">
        {editing !== null ? 
           `Edit ${editing.name} Category` :
           "Add New Category"}
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
          value={parent}
          onChange={(e: any) => setParent(e.target.value)}
        >
          <option value="">No parent category</option>
          {parentCategories.map((category: String) => (
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

      {}

      <div className="grid grid-cols-2 gap-4 mt-4">
        {parentCategories.map((parentCategory) => (
          <div key={parentCategory._id} className="border rounded p-4 bg-gray-200">
            <div className="flex gap-4">
              <h2 className="font-semibold">{parentCategory.name}</h2>
              <DeleteButton prodId={parentCategory._id}/>
            </div>
            
            <ul className="mt-2">
              {categories
                .filter(
                  (category) => category.parent?._id === parentCategory._id
                )
                .map((subCategory) => (
                  <li
                    key={subCategory._id}
                    className="flex justify-between items-center"
                  >
                    {subCategory.name}
                    <div>
                      <button
                        onClick={() => editCategory(subCategory)}
                        className="mr-2 hover:bg-blue-800 hover:text-white"
                      >
                        Edit
                      </button>
                      <DeleteButton
                        prodId={subCategory._id}
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
