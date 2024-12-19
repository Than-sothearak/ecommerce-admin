import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Category } from "@/models/Category";

export default async function handler(req, res) {
  await mongooseConnect();
  await isAdminRequest(req, res);

  const { category: catId, status = "all", page = 0 } = req.query;
  const itemPerPage = 15;

  let sorted = {};
  
  // Build status and stock filters
  if (status !== "all") {
    if (status === "inActive") sorted.status = 0;
    if (status === "active") sorted.status = 1;
    if (status === "outOfStock") sorted.stock = { $lte: 0 };
    if (status === "inStock") sorted.stock = { $gt: 0 };
  }
  
  
  // Category filters
  if (catId) {
    const categories = await Category.find();
    const childCategories = categories.filter(c => c?.parent?.toString() === catId);
    const categoriesIds = [catId, ...childCategories.map(c => c._id.toString())];
    sorted.category = { $in: categoriesIds };


//   category: {
//     '$in': [
//       '64d37efc57099d4a3b996b3e',
//       '64d380f357099d4a3b996b8d',
//       '64d3814c57099d4a3b996bb3'
//     ]
//   }
// }

  }

  // Count and retrieve paginated items
  const count = await Product.countDocuments(sorted);
  const items = await Product.find(sorted, null, { sort: { _id: -1 } })
    .skip(page * itemPerPage)
    .limit(itemPerPage);

  res.json({ 
    pagination: { count, countPage: Math.ceil(count / itemPerPage) }, 
    items 
  });
}
