import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  await isAdminRequest(req, res);
  await mongooseConnect();
  try {
    if (req.method === "PATCH") {
      const { productId, discount } = req.body;
    }
  } catch (err) {
    res.json(err);
  }
}
