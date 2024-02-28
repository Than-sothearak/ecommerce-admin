import { mongooseConnect } from "@/lib/mongoose";

import { Product } from "@/models/Product";


export default async function handler(req, res) {

  await mongooseConnect();
  try {
    if (req.method === "PUT") {
      const { productId } = req.body;
      await Product.updateOne({ _id: productId }, { discount: 0 })
      res.json(true);;
    }
  } catch (err) {
    res.json(err);
  }
}
