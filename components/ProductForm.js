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
  price: currentPrice,
  images: currentImages,
  category: currentCategory,
  properties: currentProductProps,
  status: currentStatus,
}) {
  const router = useRouter();
  const [category, setCategory] = useState(currentCategory || "");
  const [productProperties, setProductProperties] = useState(currentProductProps || {});
  const [title, setTitle] = useState(currentTitle || "");
  const [description, setDescription] = useState(currentDesc || "");
  const [stock, setStock] = useState(currentStock || "");
  const [price, setPrice] = useState(currentPrice || "");
  const [images, setImages] = useState(currentImages || []);
  const [status, setStatus] = useState(currentStatus || 0);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  useEffect(() => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  }, []);

  const updateProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Reset success message

    const data = {
      title,
      description,
      stock,
      price,
      images,
      category,
      properties: productProperties,
      status,
    };

    if (!title || !description || !price || !stock) {
      setError("Please fill in all the required fields.");
      return;
    }

    try {
      // Update Product
      await axios.put("/api/products", { ...data, _id });
      setSuccessMessage("Product updated successfully!");

      // Update the product info without reloading the page
      setTitle(data.title);
      setDescription(data.description);
      setStock(data.stock);
      setPrice(data.price);
      setImages(data.images);
      setCategory(data.category);
      setProductProperties(data.properties);
      setStatus(data.status);

       // Hide the success message after 2 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);

      // Navigate to the same page with updated query parameters (or dynamic route)
      router.push(router.asPath, undefined, { shallow: true });  // Use shallow routing to preserve the current page but update the state
    } catch (err) {
      setError("Failed to save product. Please try again.");
      console.error(err);
    }
  };

  const uploadImages = async (e) => {
    e.preventDefault();
    const files = e.target.files;

    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();

      for (const file of files) {
        data.append("file", file);
      }

      try {
        const res = await axios.post("/api/upload", data);
        setImages((prevImages) => [...prevImages, ...res.data.links]);
      } catch (err) {
        setError("Failed to upload images.");
        console.error(err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const updateImagesOrder = (newImages) => {
    setImages(newImages);
  };

  const changeProductProperty = (propertyName, value) => {
    setProductProperties((prev) => ({
      ...prev,
      [propertyName]: value,
    }));
  };

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let selectedCategory = categories.find(({ _id }) => _id === category);
    propertiesToFill.push(...(selectedCategory?.properties || []));

    while (selectedCategory?.parent?._id) {
      selectedCategory = categories.find(({ _id }) => _id === selectedCategory.parent._id);
      propertiesToFill.push(...(selectedCategory?.properties || []));
    }
  }

  return (
    <div className="relative">
      {/* Success Message */}
      {successMessage && (
  <div
    className={`fixed top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-4 rounded-md shadow-lg transition-opacity duration-300 ${
      successMessage ? "opacity-100" : "opacity-0"
    }`}
  >
    <p>{successMessage}</p>
  </div>
)}

      {/* Error Message */}
      {error && (
        <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-4 rounded-md shadow-lg">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={updateProduct}>
        <label>Product Name</label>
        <input
          required
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter product name"
        />

        <label>Status</label>
        <select
          required
          value={status}
          onChange={(e) => setStatus(Number(e.target.value))}
        >
          <option value={0}>Inactive</option>
          <option value={1}>Active</option>
        </select>

        <label>Category</label>
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <hr />
        {propertiesToFill.map((property) => (
          <div key={property.name}>
            <label>{property.name}</label>
            <select
              value={productProperties[property.name] || ""}
              onChange={(e) => changeProductProperty(property.name, e.target.value)}
            >
              <option value="">N/A</option>
              {property.values.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}

        <label>Images</label>
        <ReactSortable list={images} setList={updateImagesOrder}>
          {images.map((link, index) => (
            <div key={index} className="image-container">
              <img src={link} alt="Uploaded" className="rounded-lg h-24" />
            </div>
          ))}
        </ReactSortable>
        {isUploading && <BeatLoader />}
        <input type="file" multiple onChange={uploadImages} />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>Stock</label>
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          placeholder="Enter stock quantity"
        />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          placeholder="Enter price"
        />

        <button type="submit" className="btn-primary">
          Save
        </button>
      </form>
    </div>
  );
}
