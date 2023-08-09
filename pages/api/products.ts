import { Product } from "@/models/ProductSchema";
import mongooseConnect from "@/lib/mongoose";
export default async function handle(request: any, response: any) {
  const { method } = request;
  mongooseConnect();
  console.log("DB Connected");

// GET REQUEST
  if (method === "GET") {
    if (request.query?.id) {
      response.json(await Product.findOne({ _id: request.query?.id }));
    }
    response.json(await Product.find());
  }

// PUT REQUEST
  if (method === "PUT") {
    try {
        const {updatedTitle, updatedDescription, updatedPrice } = request.body.data;
        console.log(request.body);
        console.log(updatedTitle);
        await Product.findByIdAndUpdate(request.query.id, {
          title: updatedTitle,
          description: updatedDescription,
          price: updatedPrice,
        });

        console.log("Past updation steps");
        return response.json({
          message: "Put request success",
          status: 200,
        });
      
    } catch (error: any) {
      console.log(error.message);
    }
  }


//POST REQUEST
  if (method === "POST") {
    try {
      const { title, description, price } = request.body;
      console.log("Inside POST : "+title,description,price);
      const productDoc = await Product.create({
        title,
        description,
        price,
      });

      return response.json({
        message: "Product created successfully",
        status: 200,
        success: true,
      });
    } catch (error: any) {
      return response.json({
        status: 500,
        message: "Some error occured",
      });
    }
  }

// DELETE REQUEST
  if (method === "DELETE") {
    try {
      const id2 = request.query?.id;
      console.log(id2);
      await Product.findByIdAndDelete(id2);
      return response.json({
        message:"Deleted Product",
        status:201,
      })
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
