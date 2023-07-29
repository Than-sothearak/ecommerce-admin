import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler (req, res) {
    const { method } = req;
    await mongooseConnect();
    res.json(await Order.find().sort({createdAt: -1}));

    if (method === "DELETE") {
        const { _id } = req.query;
        await Order.deleteOne({ _id });
        res.json("ok");
      }
  
 
}