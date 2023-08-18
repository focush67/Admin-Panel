import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const CategorySchema = new Schema({
    name : {type:String , required:true},
    parent : {type:mongoose.Types.ObjectId , ref: 'Category', default:undefined},
})

export const Category = models?.Category || model('Category',CategorySchema);