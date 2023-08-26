import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Setting = ({ swal }) => {
  const [products, setProducts] = useState([]);
  const [featuredId, setFeaturedId] = useState("");

  async function saveSetting(e) {
    e.preventDefault();
    const data = {
        name: 'featuredProductId',
        value: featuredId,
      }
    await axios.put("/api/setting", data);
    swal.fire({
      title: 'Updated',
      icon: 'success',
     })
  }
  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setProducts(res.data);
    });

      axios.get('/api/setting?name=featuredProductId').then(res => {
        setFeaturedId(res.data.value)
      })
  }, []);


  return (
    <Layout>
      <h1>Setting</h1>
      <form>
        <label>Featured product</label>
        <div className="flex gap-1">
          <select
            value={featuredId}
            title="choose futured product"
            onChange={(e) => setFeaturedId(e.target.value)}
          >
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.title}
              </option>
            ))}
          </select>
        </div>

        <button
          title="Save property"
          className="btn-primary py-1"
          onClick={saveSetting}
        >
          Save setting
        </button>
      </form>
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Setting swal={swal} />);

