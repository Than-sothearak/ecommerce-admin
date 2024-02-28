import { mongooseConnect } from "@/lib/mongoose";
import { Admin } from "@/models/Admin";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handler (req, res) {
    await mongooseConnect();
    // await isAdminRequest(req, res);

    if (req.method === 'POST') {
      const {email} = req.body;
      if (await Admin.findOne({email})) {
        res.status(400).json({message: 'Admin already exists'});
      } else {
        res.json(await Admin.create({
          email,
          role: 'admin'
        }))
      }
   
    }

    if(req.method === "GET") {
      res.json(await Admin.find());
    }

    if(req.method === 'DELETE') {
      const {_id} = req.query
      res.json(await Admin.deleteOne({_id}));
      res.json("deteted!");
    }
}