import React, { useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";

const newProducts = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  
   const createProdouct = async (e) => {
    e.preventDefault();
    const data = {title,description,price};
    await axios.post('/api/products', data);
  }
  return (
    <Layout>
      <form onSubmit={createProdouct}>
        <h1>New Product</h1>
        <label>Product name</label>
        <input
          type="text"
          placeholder="new product"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        ></input>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <label>Price</label>
        <input
          type="text"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        ></input>
        <button className="btn-primary" type="submit">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default newProducts;
