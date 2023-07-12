import clientPromise from "@/lib/mongodb";
import { Product } from "@/models/Products";
import mongoose from "mongoose";
import mongooseConnect from "@/lib/mongoose";

export default function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  if (method === "POST") {
    const {title,description, price} = req.body;
    
    const productDoc = Product.create({
      title, description,price,
    })
    res.json(productDoc);
  }
}
