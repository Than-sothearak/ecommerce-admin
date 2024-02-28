import Layout from "@/components/Layout";
import React, { useContext, useState } from "react";
import Link from "next/link";

import { useEffect } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import {
  BsFillArrowLeftSquareFill,
  BsFillArrowRightSquareFill,
} from "react-icons/bs";
import { Search } from "@/components/Search";
import { CardOrder } from "@/components/CardOrder";
import { CartContext } from "@/components/context/CartContext";

const PosPage = () => {
  const { addProduct, cartProducts, decQty, incQty, qty, onAdd } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [inputs, setInputs] = useState("");
  const [page, setPage] = useState(0);
  const [itemPerPage, setItemPerPage] = useState(10);
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
      } else if (catId === "") {
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
      console.log("Someting went wrong");
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

  useEffect(() => {
    fatchData();
  }, [inputs, page, catId]);

  const handleChange = (e) => {
    setInputs(e.target.value);
  };

  function countQty (_id, stock) {
    const count = cartProducts?.filter(id => id === _id)
    return stock - count?.length;
  }


  return (
    <Layout>
      <div className="">
        <div>
          <h1>Point of sale</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4">
          <div>
            <div className="mb-2">
              <Search onChange={handleChange} />
            </div>
            <div className="flex flex-col">
              {isUploading && (
                <div className="flex justify-center">
                  <BeatLoader />
                </div>
              )}
              {inputs.length > 2 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5">
                {searchProducts.map((p) => (
                  <div  key={p._id} className="border rounded-md" title={countQty(p._id, p.stock) <= 0 ? "Product out of stock" : "Can process"}>
                    <button
                    type="btton"
                    disabled={countQty(p._id, p.stock) <= 0}
                    onClick={() => onAdd(p._id, p.title)}
                    
                    className={(countQty(p._id, p.stock) <= 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer")+" w-full p-2 bg-slate-100 rounded-md flex flex-col items-center justify-around"}
                  >
                    <div className="felx justify-center">
                      <img src={p.images[0]} className="w-20 h-20" />
                    </div>
                    <div 
                    className="p-2 bg-slate-300 text-sm rounded-md mt-2 text-slate-700">
                      <p>Quantity:{countQty(p._id, p.stock)}</p></div>

                    <div className="flex m-x-4 flex-col justify-center text-center gap-y-2 mt-2">
                      <p className="h-11 text-ellipsis overflow-hidden text-sm">
                        {p.title}
                      </p>
                      <p className="font-bold">{p.price}$</p>
                    </div>
                  </button>
                  </div>
                ))}
              </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mt-5">
                  {products.map((p) => (
                    <div  key={p._id} className="border rounded-md" title={countQty(p._id, p.stock) <= 0 ? "Product out of stock" : "Can process"}>
                      <button
                      type="btton"
                      disabled={countQty(p._id, p.stock) <= 0}
                      onClick={() =>  addProduct(p._id)}
                      
                      className={(countQty(p._id, p.stock) <= 0 ? "cursor-not-allowed opacity-20" : "cursor-pointer")+" w-full p-2 bg-slate-100 rounded-md flex flex-col items-center justify-around "}
                    >
                      <div className="felx justify-center">
                        <img src={p.images[0]} className="w-20 h-20" />
                      </div>
                      <div 
                      className="p-2 bg-slate-300 text-sm rounded-md mt-2 text-slate-700">
                        <p>Quantity:{countQty(p._id, p.stock)}</p></div>

                      <div className="flex m-x-4 flex-col justify-center text-center gap-y-2 mt-2">
                        <p className="h-11 text-ellipsis overflow-hidden text-sm">
                          {p.title}
                        </p>
                        <p className="font-bold">{p.price}$</p>
                      </div>
                    </button>
                    </div>
                  ))}
                </div>
              )}

              <footer className="mt-5 flex gap-2 items-center justify-end">
                <div className="flex gap-6">
                  <button disabled={page === 0} onClick={handlePrevious}>
                    <BsFillArrowLeftSquareFill
                      size={32}
                      color={page === 0 ? "#DCDCDC" : "#808080"}
                    />
                  </button>
                  <div className="flex gap-1 text-gray-400 items-center">
                    Page
                    <p className="text-gray-500 font-bold">
                      {page + 1}
                    </p> of{" "}
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
                        page === Math.ceil(pageCount) - 1
                          ? "#DCDCDC"
                          : "#808080"
                      }
                    />
                  </button>
                </div>
              </footer>
            </div>
          </div>
          <CardOrder />
        </div>
      </div>
    </Layout>
  );
};

export default PosPage;
