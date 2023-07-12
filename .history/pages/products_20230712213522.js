import React from "react";
import Link from "next/link";
import Layout from "@/components/layout";
import { useEffect } from "react";
import axios from "axios";
const Products = () => {
  useEffect(() => {
    const fatchData = async ()=> {
      try {
        const res = await axios.get('/products')
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
    </Layout>
  );
};

export default Products;
