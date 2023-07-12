import React from "react";
import Link from "next/link";
import Layout from "@/components/layout";
const Products = () => {
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
