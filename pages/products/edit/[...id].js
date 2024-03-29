import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
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
    <div className="px-6 py-6 border rounded-md text-sm">
    <h1 className="font-bold">Edit page</h1>
      {productInfo && <ProductForm {...productInfo} />}
    </div>
    </Layout>
  );
}
