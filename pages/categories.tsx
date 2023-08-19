/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from "@/components/Layout";
import { DeleteButton } from "./products/delete/delButton";
import mongoose from "mongoose";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";

const categories = () => {
  const [editing, setEditing] = useState({});
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState<mongoose.Types.ObjectId | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        axios.get("/api/categories").then((response: any) => {
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
      if(editing)
      {
        await axios.put("/api/categories",{...data , _id:editing._id}).then((response:any) => {
            console.log(response);
        });

        setEditing(null);
      }
      
      else
      {
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
    setEditing(category);
    setName(category.name);
    setParent(category.parent?._id);
  };

  return (
    <Layout>
      <label className="font-bold ml-3">
        { editing !== null
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
          value={parent}
          onChange={(e: any) => setParent(e.target.value)}
        >
          <option value="">No parent category</option>
          {categories.map((category: String) => (
            <option key={category._id} value={category._id} className="hover:bg-blue-800">
              {category.name}
            </option>
          ))}
        </select>
        <button className="border rounded-md px-1 m-2 mb-0 w-[20%] hover:bg-blue-900 hover:text-white justify-center">
          <div>
            Save
          </div>
        </button>
      </form>

      <table className="basic mt-2">
        <thead>
          <tr>
            <td className="font-bold">Category Name</td>
            <td className="font-semibold">Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.map((category: object) => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category.parent?.name}</td>
              <td>
                <Link href={""} onClick={() => editCategory(category)}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4 mb-0"
                  >
                    <path
                      strokeLinecap="round"
                      stroke-linejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                  Edit
                </Link>
                <DeleteButton prodId={category._id} origin="categories" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default categories;
