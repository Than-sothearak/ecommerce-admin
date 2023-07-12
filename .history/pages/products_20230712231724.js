import React, { useState } from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import { useEffect } from "react";
import axios from "axios";
const Products = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    const fatchData = async ()=> {
      try {
        const res = await axios.get('/api/products')
        setProducts(res.data)
        console.log(res.data)
      } catch (err) {
        console.log=(err);
      }
    };
    fatchData();
  }, [])
  return (
    <Layout>
      <Link
        href="/products/new"
        className="bg-blue-900 rounded-md py-1 px-2 text-white"
      >
        Add new product
      </Link>
      <table className="basic mt-2">
        <thead>
          <tr>
            <td>Product name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
        </tbody>
      </table>
    </Layout>
  );
};

export default Products;
