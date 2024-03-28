import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";
import { Category } from "@/models/Category";

export default async function handler(req, res) {

  await mongooseConnect();
  await isAdminRequest(req, res);
  const catId = req.query.category;
  const { status } = req.query;

  const page = req.query.page || 0;
  const itemPerPage = 15;
  const productQuery = {};
  
  let sorted;

  if (status === "all") {
    sorted = {};
  } else if (status === "inActive") {
    sorted = { status: 0 };
  } else if (status === "active") {
    sorted = { status: 1 };
  }


  if (catId) {
    const categories = await Category.find();
    const categoriesHaveParent = categories.filter(
      (c) => c?.parent?.toString() === catId
    );
    // get the id of child category
    const childIds = categoriesHaveParent.map((c) => c._id.toString());
    const categoriesIds = [catId, ...childIds];

    if (status === "all") {
      sorted = { category: categoriesIds };
    } else if (status === "inActive") {
      sorted = { category: categoriesIds, status: 0 };
    } else if (status === "active") {
      sorted = { category: categoriesIds, status: 1 };
    }

    const items = await Product.find(sorted, null, {
      sort: { _id: -1 },
    })
      .skip(page * itemPerPage)
      .limit(itemPerPage);
    const count = items.length;
    const countPage = count / itemPerPage;
    res.json({ pagination: { count, countPage }, items });
  } else {
    const count = await Product.estimatedDocumentCount(productQuery);
    const countPage = count / itemPerPage;
  
    const items = await Product.find(sorted, null, { sort: { _id: -1 } })
      .skip(page * itemPerPage)
      .limit(itemPerPage);

    res.json({ pagination: { count, countPage }, items });
  }
}
