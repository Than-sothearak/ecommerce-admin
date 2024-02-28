import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handeler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);
  const { method } = req;
  const id = req.body.id;

  if( method === 'GET') {
    res.json(await Product.find());

  }
  
}