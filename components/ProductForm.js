import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
export default function ProductForm({
  _id,
  title: currentTitle,
  description: currentDesc,
  price: currntPrice,
}) {
  const router = useRouter();
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [price, setPrice] = useState(currntPrice || "");
  const [goToProduct, setGoToProduct] = useState(false);

  const createProdouct = async (e) => {
    e.preventDefault();
    const data = { title, description, price };
    if (_id) {
      //updateForm
      await axios.put("/api/products", { ...data, _id });
    } else {
      //insertForm
      if (title === "" || description === "" || price === "") {
        alert("please input value");
      } else {
        await axios.post("/api/products", data);
      }
    }

    setGoToProduct(true);
    alert('updated!')
  };
  if (goToProduct) {
    router.push("/products");
  }
  return (
    <form onSubmit={createProdouct}>
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
        type="number"
        placeholder="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      ></input>
      <button className="btn-primary" type="submit">
        Save
      </button>
    </form>
  );
}
