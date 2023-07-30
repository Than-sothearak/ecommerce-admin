import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: currentTitle,
  description: currentDesc,
  stock: currentStock,
  price: currntPrice,
  images: currentImages,
  category: currentCategory,
  properties: currentProductProps,
}) {
  const router = useRouter();
  const [category, setCategory] = useState(currentCategory || "");
  const [productProperties, setProductProperties] = useState(currentProductProps || {});
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [stock, setStock] = useState(currentStock || '')
  const [price, setPrice] = useState(currntPrice || "");
  const [images, setImages] = useState(currentImages || []);
  const [goToProduct, setGoToProduct] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const createProdouct = async (e) => {
    e.preventDefault();
    const data = {
      title,
      description,
      stock,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (_id) {
      //updateForm
      await axios.put("/api/products", { ...data, _id });
      alert("updated!");
    } else {
      //Create
      if (title === "" || description === "" || price === "" || stock === "") {
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
    e.preventDefault();
    const files = e.target?.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((images) => {
        return [...images, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images) {
    setImages(images);
  }

  function changeProductProperty(propertyName, value) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propertyName] = value;
      return newProductProps;
    });
  }
  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let selectCatInfo = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...selectCatInfo?.properties);
    while (selectCatInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === selectCatInfo.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      selectCatInfo = parentCat;
    }
  }
  
  return (
    <form onSubmit={createProdouct}>
      <label>Product name</label>
      <input
        required
        type="text"
        placeholder="new product"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      ></input>
      <label>Category</label>

      <select 
      required
      value={category} 
      onChange={(e) => setCategory(e.target.value)}>
        <option value="">N/a</option>
        {categories.length > 0 &&
          categories.map((category) => (
            <option
              required
              key={category.name}
              title={category.name}
              value={category._id}
            >
              {category.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((property) => (
          <div
            title="select property"
            key={property.name}
            className="flex gap-1"
          >
            <div>{property.name}</div>
            <select
              value={productProperties[property.name]}
              onChange={(e) =>
                changeProductProperty(property.name, e.target.value)
              }
            >
              <option>N/a</option>
              {property.values.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-wrap gap-1"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div key={link} className="h-24">
                <img src={link} alt={link} className="rounded-lg h-24" />
              </div>
            ))}
        </ReactSortable>

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
      <label>Stock</label>
      <input
        type="number"
        placeholder="quantity"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
      ></input>
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
