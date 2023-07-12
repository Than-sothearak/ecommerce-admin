import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function EditProductPage() {
    const router = useRouter();
    const {id} = router.query;

    useEffect(()=> {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(res => {
            console.log(res.data)
        });
    }, [id])
 return (
    <Layout>
        <ProductForm />
    </Layout>
 )
}