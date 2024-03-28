import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

const Setting = ({ swal }) => {
  const [products, setProducts] = useState([]);
  const [featuredId, setFeaturedId] = useState("");
  const [shippingFee, setShippingFee] = useState("");

  async function saveSetting(e) {
    e.preventDefault();
    const data = {
        name: 'featuredProductId',
        value: featuredId,
      }
    const shipping = {
      name: 'shippingFee',
      value: shippingFee,
    }
    await axios.put("/api/setting", data);
    await axios.put("/api/setting", shipping);
    swal.fire({
      title: 'Updated',
      icon: 'success',
     })
  }
  useEffect(() => {
    axios.get("/api/products").then((res) => {
      setProducts(res.data.items);
    });

      axios.get('/api/setting?name=featuredProductId').then(res => {
        setFeaturedId(res.data.value)
      })
      axios.get('/api/setting?name=shippingFee').then(res => {
        setShippingFee(res.data?.value)
      })
  }, []);


  return (
    <Layout>
      <div className="px-6 py-6 border rounded-md text-sm">
      <h1>Setting</h1>
      <form>
        <label>Featured product</label>
        <div className="flex gap-1">
         {products.length > 0 && (
           <select
           value={featuredId}
           title="choose futured product"
           onChange={(e) => setFeaturedId(e.target.value)}
         >
           {products?.map((product) => (
             <option key={product._id} value={product._id}>
               {product.title}
             </option>
           ))}
         </select>
         )}
          
        </div>
        <label>Shipping fee in USD</label>
        <div className="flex gap-1">
          <input 
          value={shippingFee}
          onChange={e => setShippingFee(e.target.value)}
          type="number" 
          placeholder="shipping fee"/>
          
        </div>

        <button
          title="Save property"
          className="btn-primary py-1"
          onClick={saveSetting}
        >
          Save setting
        </button>
      </form>
      </div>
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Setting swal={swal} />);

