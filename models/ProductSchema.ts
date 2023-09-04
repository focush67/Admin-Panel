import {model,Schema,models} from "mongoose";
import mongoose from "mongoose";

const productSchema = new Schema({
    title : {type:String,required:true},
    description : String,
    price : {type:String,required:true},
    imagesFolder : {type:String,default:"images"},
    category : {type:mongoose.Types.ObjectId , ref: 'Category', default:undefined},
    properties:[
        {
            name : {type:String,default:""},
            value:{type:String,default:""},
        }
    ]
    
})

export const Product = (models.Product || model('Product',productSchema))


