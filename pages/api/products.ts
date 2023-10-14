import { Product } from "@/models/ProductSchema";
import mongooseConnect from "@/lib/mongoose";
import { Category } from "@/models/CategorySchema";
import { isAdminRequest } from "./auth/[...nextauth]";
import stripe from 'stripe';

const stripeClient = new stripe(process.env.NEXT_PUBLIC_STRIPE_PRIVATE_KEY);

export default async function handle(request: any, response: any) {
  const { method } = request;
  mongooseConnect();
  await isAdminRequest(request,response);
  console.log("DB Connected");

// GET REQUEST
  if (method === "GET") {
    console.log("INSIDE GET");
    if (request.query?.id) {
      response.json(await Product.findOne({ _id: request.query?.id }));
    }
    response.json(await Product.find());
  }

// PUT REQUEST
  if (method === "PUT") {
    try {
        const prodId = request.query.id;
        console.log("INSIDE PRODUCT PUT");
  
        const {title,description,price,imagesFolder,category,properties} = request.body;

        console.log(title+" "+description+" "+price+" "+category._id);  
        
        let updatedProduct = await Product.findById(prodId);

       
        const stripeProduct = await stripeClient.products.create({
            name: title,
            description,
          });

        updatedProduct.stripeID = stripeProduct.id;

  
        
        const res = await Product.findByIdAndUpdate(prodId,{title,description,price,imagesFolder,category,properties,stripeID: updatedProduct.stripeID});

        await Category.findByIdAndUpdate(prodId , {
          name : title,
          parent : category,
          properties,
        });

        console.log(res);
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
      const {title, description, price , imagesFolder,category,properties} = request.body;
      console.log("INSIDE PRODUCT POST : "+title,description,price,imagesFolder,category);

      const isThereAlready = await Product.findOne({title});

      if(isThereAlready){
        console.log("Product already exists");
        return response.json({
          message:"User already exists",
          status:400,
          success:false,
        })
      }
      
      const stripeProduct = await stripeClient.products.create({
        name: title,
        description,
        
      });

      const stripeProductID = stripeProduct.id;


      const createdProduct = await Product.create({
        title,
        description,
        price,
        imagesFolder,
        category,
        properties,
        stripeID: stripeProductID,
      });

      const productId = createdProduct._id;

      await Category.create({
        _id : productId,
        name : title,
        parent : category,
        properties
      })

      return response.json({
        message: "Product created successfully",
        status: 200,
        success: true,
      });
    } catch (error: any) {
      console.log(error.message);
      return response.json({
        status: 500,
        message: "Some error occured",
      });
    }
  }

// DELETE REQUEST
  if (method === "DELETE") {
    try {
      console.log("INSIDE PRODUCT DELETE");
      const id2 = request.query?.id;
      console.log(id2);
      await Product.findByIdAndDelete(id2);
      await Category.findByIdAndDelete(id2);
      return response.json({
        message:"Deleted Product",
        status:201,
      })
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
