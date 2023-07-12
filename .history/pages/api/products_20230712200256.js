import {Product} from "@/models/Product";
import mongooseConnect from "@/lib/mongoose";

export default function handler(req, res) {
  const { method } = req;
  mongooseConnect();
  if (method === "POST") {
    const {title,description, price} = req.body;
    
    const productDoc = Product.create({
      title, description,price,
    })
    res.json(productDoc);
  }
}
