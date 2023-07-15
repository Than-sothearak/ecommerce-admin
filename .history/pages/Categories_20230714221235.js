import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { withSwal } from "react-sweetalert2";

function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchCategoryData = async () => {
    try {
      setIsUploading(true);
      const res = await axios.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.log = err;
    }
    setIsUploading(false);
  };

  async function saveCategory(e) {
    e.preventDefault();
    const data = { name, parentCategory };
    if (editedCategory) {
      //Update category
      await axios.put("/api/categories", { ...data, _id: editedCategory._id });
    } else {
      //Create category
      await axios.post("/api/categories", { name });
    }
    setEditedCategory(null);
    setParentCategory("");
    fetchCategoryData();
    setName("");
    setCategories("");
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }
  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          await axios.delete("/api/categories?_id=" + _id);
          fetchCategoryData();
        }
      });
  }
  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", value: "" }];
    });
  }
  function handlePropertyNameChange (index, property, newName) {
     setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      console.log(properties)
      return properties;
      
     })
  }
  function handlePropertyValueChange (index, property, newValue) {
    setProperties(prev => {
     const properties = [...prev];
     properties[index].value = newValue;
     console.log(properties)
     return properties;
     
    })
 }
  
  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category "${editedCategory.name}"`
          : "Create new category name"}
      </label>
      <form onSubmit={saveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            <option value="">No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button
            type="button"
            onClick={addProperty}
            className="btn-default text-sm"
          >
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mt-2" key={index}>
                <input
                  type="text"
                  value={property.name}
                  onChange={e => handlePropertyNameChange(index, property,e.target.value)}
                  placeholder="property name (ex: color)"
                />
                <input
                  type="text"
                  value={property.value}
                  onChange={e =>handlePropertyValueChange(index, property,e.target.value)}
                  placeholder="values, comma separated"
                />
              </div>
            ))}
        </div>

        <button className="btn-primary py-1" type="submit">
          Save
        </button>
      </form>
      {isUploading && (
        <div className="flex justify-center">
          <BeatLoader />
        </div>
      )}
      <table className="basic mt-4">
        <thead>
          <tr>
            <td className="font-bold">Category</td>
            <td className="font-bold">Parent Category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => (
              <tr key={category.name}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td className="flex">
                  <button
                    onClick={() => editCategory(category)}
                    className="flex items-center gap-1 btn-primary mr-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(category)}
                    className="flex btn-delete gap-1 mr-1 items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
