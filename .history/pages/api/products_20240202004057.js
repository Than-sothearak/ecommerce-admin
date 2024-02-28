import { Product } from "@/models/Product";
import { mongooseConnect } from "@/lib/mongoose";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();
  await isAdminRequest(req, res);
  const { phrase } = req.query;
  const {categories} = req.query;
  console.log("cat" + "=" +categories)
  if (method === "GET") {
    const page = req.query.page || 0;
    const itemPerPage = 20;
    const productQuery = {};
  
    if (categories) {
    
      const productByCat =  await Product.find({ category: categories});
      const items = (await Product
        .find(productByCat)
        .skip(page * itemPerPage)
        .limit(itemPerPage)
        )
        const countPageS = items.length / itemPerPage;
      
        res.json({
          pagination: { count, countPageS }, items
        })
        ;
    }
    const count = await Product.estimatedDocumentCount(productQuery);
   
    if (phrase) {
      productQuery["$or"] = [
        { title: { $regex: phrase, $options: "i" } },
        { desciption: { $regex: phrase, $options: "i" } },
      ];
     
      const items = (await Product
        .find(productQuery)
        .skip(page * itemPerPage)
        .limit(itemPerPage)
        )
        const countPageS = items.length / itemPerPage;
      
        res.json({
          pagination: { count, countPageS }, items
        })
        ;
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
    const { title, description, price, images, category, properties, stock } =
      req.body;
    const productDoc = await Product.create({
      title,
      description,
      price,
      images,
      category,
      properties,
      stock,
    });
    res.json(productDoc);
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
    } = req.body;
    await Product.updateOne(
      { _id },
      { title, description, price, images, category, properties, stock }
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