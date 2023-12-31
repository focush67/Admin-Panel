import { model, Schema, models } from "mongoose";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

const productSchema = new Schema({
  creator: {type: String,required: true},
  title: { type: String, required: true },
  description: String,
  price: { type: String, required: true },
  imagesFolder: { type: String, default: "images" },
  category: { type: mongoose.Types.ObjectId, ref: "Category", default: undefined },
  properties: [
    {
      name: { type: String, default: "" },
      value: { type: String, default: "" },
    },
  ],

  stripeProductID: {type: String,required: true},
},
{
  timestamps: true,
});

export const Product = models.Product || model("Product", productSchema);
