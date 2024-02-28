import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
    await isAdminRequest(req, res);
    await mongooseConnect();
 try {
    if (req.method === "POST") {
        const {
          name,
          email,
          city,
          phone,
          cartProducts,
          products,
        } = req.body;
   
        const productsIds = cartProducts;
        const uniqueIds = [...new Set(productsIds)];
        const productsInfos = await Product.find({ _id: uniqueIds });

      
    
        let line_items = [];
        for (const productId of uniqueIds) {
          const productInfo = products.find(
            (p) => p._id.toString() === productId
          );
          const quantity =
            productsIds.filter((id) => id === productId)?.length || 0;
          if (quantity > 0 && productInfo) {
            line_items.push({
              quantity,
              price_data: {
                currency: "USD",
                product_data: { name: productInfo.title },
                unit_amount: productInfo.discount ? (quantity * productInfo.price) - (quantity * productInfo.price * productInfo.discount / 100 ) : quantity * productInfo.price ,
              },
            });
          }

          await Product.updateMany({_id: productId}, {stock: productInfo.stock ? productInfo.stock - quantity : 0})
        }
    
       await Order.create({
          line_items,
          name,
          email,
          city,
          phone,
          paid: true,
      
        });
      } else {
        res.json("should be a POST request");
        return;
      }
 } catch (err) {
    res.json(err)
 }
}
