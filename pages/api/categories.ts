import connect from "@/lib/mongoose";
import { Category } from "@/models/CategorySchema";
import { isAdminRequest, options } from "./auth/[...nextauth]";
export default async function handle(request: any, response: any) {
  const { method } = request;
  connect();
  await isAdminRequest(request,response);
  // GET Request
  if (method === "GET") {
    if (request.query?.id) {
      response.json(await Category.findOne({ _id: request.query?.id }));
    }

    response.json(await Category.find().populate("parent"));
  }

  // PUT Request
  if (method === "PUT") {
    try {
      console.log("INSIDE CATEGORY PUT");
      const _id = request.query?.id;
      const { name, parent, properties } = request.body;
      console.log(name + " " + parent);
      const exists = Category.findById(_id);

      if(!exists)
      {
        console.log("Not found in category");
        return response.json(
          {
            status:300,
          }
        )
      }
      const updatedCategory = await Category.findByIdAndUpdate(_id, {
        name,
        parent,
        properties,
      });

      if(!updatedCategory)
      {
        return response.json({
          message:"Category not found",
          status:404,
        })
      }

      console.log(updatedCategory);

      return response.json({
        message:"Updation Successfull",
        status:201,
      })

    } catch (error: any) {
      console.log(error.message);
      return response.json({
        message:"Internal Server Error",
        status:500,
      })
    }
  }

  // POST Request

  if (method === "POST") {
    try {
      console.log("INSIDE CATEGORY POST");
      let { name, parent, properties } = request.body;
      const isPresent = await Category.findOne({ name });

      if (isPresent) {
        return response.json({
          message: "Product Already Exists",
          status: 400,
        });
      }

      if(parent === "") parent = null;
      await Category.create({ name, parent, properties });

      return response.json({
        message: "Product saved in Category",
        status: 201,
      });
    } catch (error: any) {
      console.log(error.message);
      return response.json({
        message: "Some error occured",
        status: 500,
      });
    }
  }

  // DELETE Request

  if (method === "DELETE") {
    try {
      const id = request.query?.id;
      const exists = Category.findOne({ id });

      if (!exists) {
        return response.json({
          message: "Product not found in categories",
          status: 404,
        });
      }

      console.log("DELETING FROM CATEGORY ", id);
      await Category.findByIdAndDelete(id);

      return response.json({
        message: `Deleted Category ${id}`,
        status: 201,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
