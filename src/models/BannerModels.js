const mongoose =require("mongoose");
const bannerSchema = new mongoose.Schema(
{
image:{type:String, required:true},
ttile:{type:String, required:true},
description:{type:String, required:true},
productLink:{type:mongoose.Schema.Types.ObjectId,ref:product },
discountPercentage:{type:Number, default:0}
},

{timestamps:true});

module.exports = mongoose.model("Banner",bannerSchema);




