import { Product } from "@/models/ProductSchema";
import mongooseConnect from "@/lib/mongoose";
export default async function handle(request: any, response: any) {
  const { method } = request;
  mongooseConnect();
  console.log("DB Connected");
  if (method === "GET") {
    if (request.query?.id) {
      response.json(await Product.findOne({ _id: request.query?.id }));
    }
    response.json(await Product.find());
  }

  if (method === "POST") {
    try {
      const { title, description, price } = request.body;
      console.log("Inside POST");
      const user = Product.findOne({title});
      const productDoc = await Product.create({
        title,
        description,
        price,
      })

      response.json(productDoc);
      //const user = Product.findOne({ title });
      // if (user === null) {
      //   console.log("Creating new user");
      //   await Product.create({
      //     title,
      //     description,
      //     price,
      //   });
      //   console.log("Product Created");
      //   return response.json({
      //     status:200,
      //     message:"Product created",
      //   })
      // } else {
      //   const productDoc = await Product.findOne({ title });

      //   productDoc.description = description;
      //   productDoc.price = price;

      //   await productDoc.save();
      //   console.log("Product updated");
      //   return response.json({
      //     status:200,
      //     message:"Product Updated",
      //   })
      // }
    } catch (error: any) {
      return response.json({
        status:500,
        message:"Some error occured",
      });
    }
  }
}
