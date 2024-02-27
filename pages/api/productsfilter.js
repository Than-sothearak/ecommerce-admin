import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  const catId = req.query.category;
  
  if (method === "GET") {
    const page = req.query.page || 0;
    const itemPerPage = 15;
    const productQuery = {};
    
    if (catId) {
      const childCategory = await Category.find({ parent: catId });
      const categories = await Category.find();

    
        const categoriesHaveParent = categories.filter(
          (c) => c?.parent?.toString() === catId
        );
    
        // get the id of child category
    
        const childIds = categoriesHaveParent.map((c) => c._id.toString());
        const categoriesIds = [catId, ...childIds];
      
      const items = await Product.find({ category: categoriesIds }, null, {
        sort: { _id: -1 },
      })
        .skip(page * itemPerPage)
        .limit(itemPerPage);
      const count = items.length
      const countPage = count / itemPerPage;
      res.json({ pagination: {count, countPage }, items });
    } else {
      const count = await Product.estimatedDocumentCount(productQuery);
      const countPage = count / itemPerPage;
      const items = await Product.find({}, null, { sort: { _id: -1 } })
        .skip(page * itemPerPage)
        .limit(itemPerPage);
      
      res.json({ pagination: { count, countPage }, items });
    }
  }
}
