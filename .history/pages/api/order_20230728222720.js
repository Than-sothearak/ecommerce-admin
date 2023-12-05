import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler (req, res) {
    await mongooseConnect();
    res.json(await Order.find().sort({createdAt: -1}));

    // if (method.req === "DELETE") {
    //     const { _id } = req.query;
    //     await Order.deleteOne({ _id });
    //     res.json("ok");
    //   }

    if(method.req.body === "DELETE") {
        if (req.query?.id) {
          await Product.deleteOne({_id:req.query?.id});
          res.json(true);
        }
      }
}