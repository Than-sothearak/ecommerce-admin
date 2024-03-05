import React, { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { Search } from "@/components/Search";
import { TableProduct } from "@/components/TableProduct";

const Products = ({}) => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState('')
  const [isUploading, setIsUploading] = useState(false);
  const [inputs, setInputs] = useState("");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageCountS, setPageCountS] = useState(0);

  const fatchData = async () => {
    try {
      setIsUploading(true);
      if (inputs.length > 2) {
        const url = "api/products?phrase=" + encodeURIComponent(inputs);
        setIsUploading(true);
        axios.get(url).then((res) => {
          setSearchProducts(res.data.items);
          setPageCountS(res.data.pagination.countPageS);
          setPage(0);
          setIsUploading(false);
        });
      } else if (catId === '') {
        const ressult = await axios.get("/api/categories");
        setCategories(ressult.data);
        const res = await axios.get("/api/products?page=" + page);
        setProducts(res.data.items);
        setPageCount(res.data.pagination.countPage);
      } else if (catId.length > 1) {

        const ressult = await axios.get("/api/categories");
        setCategories(ressult.data);
        const res = await axios.get("/api/productsfilter?category=" + catId);
        setProducts(res.data.items);
        setPageCount(res.data.pagination.countPage);
      }
    } catch (err) {
      console.log = err;
    }
    setIsUploading(false);
  };

  function handlePrevious() {
    setPage((p) => {
      if (p === 0) return p;
      return p - 1;
    });
  }
  function handleNext() {
    setPage((p) => {
      if (p === pageCount) return p;
      return p + 1;
    });
  }
  function handleBackWard() {
    setPage(0);
  }
  useEffect(() => {
    fatchData();
  }, [inputs, page, catId]);
  
  const handleChanged = (value) => {
     setCatId((prev) => (prev === value ? '' : value));
  }

  const mainCats = categories.filter((c) => !c.parent);
  
  const handleChange = (e) => {
  setInputs(e.target.value)
  }
  return (
    <Layout>
      <Link
        title="add new product"
        href="/products/new"
        className="bg-primary btn-primary"
      >
        Add new product
      </Link>
    <div className='my-5'>
    <Search onChange={handleChange}/>
    </div>
      <div className="w-full">
        <p>Filter by categories</p>

        <div className="flex flex-wrap gap-5 mt-2 mb-2">
          { mainCats.map((c) => (
            <div className="flex align-bottom gap-2 w-auto" key={c._id}>
            <div onChange={(e) => handleChanged(e.target.value)}>
              <input 
              type="checkbox" 
              value={c._id} 
              checked={catId === c._id}
              className="w-4 h-4" />
            </div>
            <div>
              <p>{c.name}</p>
            </div>
          </div>
          ))}
        </div>
      </div>
      {isUploading && (
        <div className="flex justify-center">
          <BeatLoader />
        </div>
      )}
      {inputs.length > 2 ? (
        <>
          <TableProduct products={searchProducts} categories={categories}/>
          <footer className="mt-5 flex gap-2 items-center justify-center">
            <button disabled={page === 0} onClick={handlePrevious}>
              <BsFillArrowLeftSquareFill size={24} color="gray" />
            </button>
            <div className="flex gap-1 text-gray-400">
              Page
              <p className="text-gray-500 font-bold">{page + 1}</p> of{" "}
              <p className="text-gray-500 font-bold">{Math.ceil(pageCountS)}</p>
            </div>
            <button
              disabled={page === Math.ceil(pageCountS) - 1}
              onClick={handleNext}
            >
              <BsFillArrowRightSquareFill size={24} color="gray" />
            </button>
          </footer>
        </>
      ) : (
        <>
          
          <TableProduct products={products} categories={categories}/>
          <footer className="mt-5 flex gap-2 items-center justify-between">
            <div className="flex gap-6">
              <button disabled={page === 0} onClick={handlePrevious}>
                <BsFillArrowLeftSquareFill
                  size={32}
                  color={page === 0 ? "#DCDCDC" : "#808080"}
                />
              </button>
              <div className="flex gap-1 text-gray-400 items-center">
                Page
                <p className="text-gray-500 font-bold">{page + 1}</p> of{" "}
                <p className="text-gray-500 font-bold">
                  {Math.ceil(pageCount)}
                </p>
              </div>
              <button
                disabled={page === Math.ceil(pageCount) - 1}
                onClick={handleNext}
              >
                <BsFillArrowRightSquareFill
                  size={32}
                  color={
                    page === Math.ceil(pageCount) - 1 ? "#DCDCDC" : "#808080"
                  }
                />
              </button>
            </div>
            <button onClick={handleBackWard}>
              <p className="text-gray-700 hover:text-blue-500">
                Back to default page
              </p>
            </button>
          </footer>
        </>
      )}
    </Layout>
  );
};

export default Products;