import { Category } from "@/models/Category";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
  const { method } = req;
  await mongooseConnect();

  
  if (method === "GET") {
    res.json(await Category.find().populate("parent"));
    
  }

  if (method === "POST") {
    const { name, parentCategory,propertires } = req.body;
    const categoryDoc = await Category.create({
      name,
      parent: parentCategory,
      propertires,
    });
    res.json(categoryDoc);
  }

  if (method === "PUT") {
    const { name, parentCategory, _id } = req.body;
    const categoryDoc = await Category.updateOne(
      { _id },
      { name, parent: parentCategory }
    );
    res.json(categoryDoc);
  }

  if (method === "DELETE") {
    const { _id } = req.query;
    await Category.deleteOne({ _id });
    res.json("ok");
  }
}
