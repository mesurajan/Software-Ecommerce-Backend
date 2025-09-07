const mongoose=require("mongoose");
const productSchema = new mongoose.Schema(
{
category:{ type: mongoose.Schema.Types.ObjectId, ref:"Category", required:true},
user: {type: mongoose.Schema.Types.ObjectId,ref:"User", required:true}, 
title:{type: String, required:true},
image:{tye: String, required:true },
price:{type: Number, required:true},
discountedPrice: {type:Number},
shortDescription:{ type: String},
videoId: {type: String},
discountId: {type: String}
},

{ timestamps:true});

module.exports = mongoose.model("Product" , productSchema);
