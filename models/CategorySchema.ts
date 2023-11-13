import { Schema, model, models } from "mongoose";
import mongoose from "mongoose";
const CategorySchema = new Schema({
    creator: {type: String,required: true,default:"sparshv70@gmail.com"},
    name : {type:String , required:true},
    parent : {type:mongoose.Types.ObjectId , ref: 'Category', default:null},
    properties:[
        {
            name : {type:String,default:""},
            value : {type:String,default:""},
        },
    ], 
},{
    timestamps:true,
})

export const Category = models?.Category || model('Category',CategorySchema);