import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);

  const { phrase } = req.query;
  const catId = req.query.category;
  const { status } = req.query;
  let sorted;

  if (status === "inActive") {
    sorted = 0;
  } else if (status === "active") {
    sorted = 1;
  }

  if (method === "GET") {
    const page = req.query.page || 0;
    const itemPerPage = 15;
    const productQuery = {};

    const count = await Product.estimatedDocumentCount(productQuery);

    if (phrase) {
      if (sorted === undefined) {
        productQuery["$or"] = [
          { title: { $regex: phrase, $options: "i" } },
          { desciption: { $regex: phrase, $options: "i" } },
        ];
      } else {
        productQuery["$or"] = [
          { title: { $regex: phrase, $options: "i" }, status: sorted },
          { desciption: { $regex: phrase, $options: "i" }, status: sorted },
        ];
      }

      const items = await Product.find(productQuery)
        .skip(page * itemPerPage)
        .limit(itemPerPage);
      const countPageS = items.length / itemPerPage;

      res.json({
        pagination: { count, countPageS },
        items,
      });
    } else {
      if (req.query?.id) {
        res.json(await Product.findOne({ _id: req.query.id }));
      } else {
        const countPage = count / itemPerPage;
        const items = await Product.find({}, null, { sort: { _id: -1 } })
          .skip(page * itemPerPage)
          .limit(itemPerPage);
        res.json({ pagination: { count, countPage }, items });
      }
    }
  }
  if (method === "POST") {
    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      status,
    } = req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      status,
    });
    res.json(productDoc);
  }
  const products = await Product.find({stock: 0});
 
  if (products.length > 0) {
    for (const productStatus of products ) {
      await Product.updateOne({
        _id: productStatus._id,
      }, {status: 0});
      res.json
    }
  }
  
  if (method === "PUT") {

    const {
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
      _id,
      status,
    } = req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties, stock, status }
    );
    res.json(true);
  }

  if (method === "DELETE") {
    if (req.query?.id) {
      await Product.deleteOne({ _id: req.query?.id });
      res.json(true);
    }
  }
}
