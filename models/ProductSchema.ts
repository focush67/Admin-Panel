import { model,Schema , models } from "mongoose";

const productSchema = new Schema({
    title : {type:String,required:true},
    description : String,
    price : {type:String,required:true},
    images : {type:String,default:"images"},
})

const imageSchema = new Schema({
    folder : String,
})

export const Product = (models.Product || model('Product',productSchema))

export const Image = (models.Product || model('Image',imageSchema));
