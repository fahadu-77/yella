import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description:{ type:String},
    price: { type: Number, required: true },
    category: { 
        type: String,
        enum:['groceries','diary','snacks','beverages','household'],
        required: true
    },
    imageUrl: { type: String, required: true },
    whStock: { type: Number, required: true, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);
 
export const Product = mongoose.model('Product',productSchema)