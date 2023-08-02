import { model,Schema , models } from "mongoose";

const productSchema = new Schema({
    title:{type:String,required:true},
    description:String,
    price:{type:String,required:true},
})

export const Product = (models.Product || model('Product',productSchema))