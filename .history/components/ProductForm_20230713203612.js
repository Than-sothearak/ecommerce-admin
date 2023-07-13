import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BeatLoader } from "react-spinners";

export default function ProductForm({
  _id,
  title: currentTitle,
  description: currentDesc,
  price: currntPrice,
  images: currentImages,
}) {
  const router = useRouter();
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [price, setPrice] = useState(currntPrice || "");
  const [images, setImages] = useState(currentImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const createProdouct = async (e) => {
    e.preventDefault();
    const data = { title, description, price, images };
    if (_id) {
      //updateForm
      await axios.put("/api/products", { ...data, _id });
      alert("updated!");
    } else {
      //insertForm
      if (title === "" || description === "" || price === "") {
        alert("please input value");
      } else {
        await axios.post("/api/products", data);
      }
    }

    setGoToProduct(true);
  };
  if (goToProduct) {
    router.push("/products");
  }

  async function UploadImages(e) {
    const files = e.target?.files;
   
    if (files?.length > 0) {
      setIsUploading(true)
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((images) => {
        return [...images, ...res.data.links];
      });
      setIsUploading(false)
    }
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
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        {!!images?.length && images.map(link => (
          <div key={link} className="h-24 relative">
           <img src= {link} alt={link} className="rounded-lg"/>
           <div  className="absolute bg-black cursor-pointer"><h1>Xsdsd</h1></div>
          </div>
        ))}
        {isUploading && (
          <div className="h-24">
             <BeatLoader />
          </div>
        )}
        <label className="w-24 h-24 text-center flex items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"
            />
          </svg>
          <div>Upload</div>
          <input type="file" className="hidden" onChange={UploadImages} />
        </label>
        {!images?.length && <div>No Photo</div>}
      </div>
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
