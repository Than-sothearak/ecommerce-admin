import { useState } from "react";
import Layout from "@/components/Layout";
import axios from "axios";
import {useRouter } from "next/router";

const newProducts = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState("");
  const[goToProduct, setGoToProduct] = useState(false);
  const router = useRouter();
   
  const handleChange = (e) => {
      let input = e.target.value;
  }
   const createProdouct = async (e) => {
    e.preventDefault();
    const data = {title,description,price};
    await axios.post('/api/products', data);
    setGoToProduct(true)
  }
  if(goToProduct) {
    router.push('/products')
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
          onChange={setTitle(handleChange)}
        ></input>
        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={setDescription(handleChange)}
        ></textarea>
        <label>Price</label>
        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={setPrice(handleChange)}
        ></input>
        <button className="btn-primary" type="submit">
          Save
        </button>
      </form>
    </Layout>
  );
};

export default newProducts;
