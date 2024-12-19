import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage() {
  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get("/api/products?id=" + id).then((res) => {
      setProductInfo(res.data);
    });
  }, [id]);

  return (
    <Layout>
            <div className={`p-2  text-white ${productInfo?.status === 1 ? "bg-green-500" : "bg-red-600"}`}>{productInfo?.status === 1 ? "Actived" : "The item is In active"}</div>
    <div className="px-6 py-6 border rounded-md text-sm">

    <div className="flex gap-2 justify-between">
    
    <h1 className="font-bold">Edit page</h1>
    <Link href="/products" className="hover:text-blue-500">Back</Link>
    </div>
      {productInfo && <ProductForm {...productInfo} />}
    </div>
    </Layout>
  );
}
