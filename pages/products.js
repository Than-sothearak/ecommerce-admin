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
import card from "@material-tailwind/react/theme/components/card";

const Products = ({}) => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [catId, setCatId] = useState("all");

  const [isUploading, setIsUploading] = useState(false);
  const [inputs, setInputs] = useState("");
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [pageCountS, setPageCountS] = useState(0);
  const [categoryName, setCategoryName] = useState("all");
  const [status, setStatus] = useState("all");
  const [stocks, setStocks] = useState("all");

  const STATUS_FILTER = {
    id: "status",
    name: "status",
    options: [
      { value: "all", label: "All " },
      { value: "inActive", label: "InActive " },
      { value: "active", label: "Active" },
      { value: "inStock", label: "In stock" },
      { value: "outOfStock", label: "Out of Stock" },
    ],
  };

  const fatchData = async () => {
    try {
      setIsUploading(true);

      if (inputs.length > 2) {
        const url = "api/products?phrase=" + encodeURIComponent(inputs) + "&status=" + status + "&category=" + catId;
        setIsUploading(true);
        axios.get(url).then((res) => {
          setSearchProducts(res.data.items);
          setPageCountS(res.data.pagination.countPageS);
          setPage(0);
          setIsUploading(false);
        });
      }
      if (catId === "all") {
        const ressult = await axios.get("/api/categories");
        setCategories(ressult.data);
        const res = await axios.get(
          "/api/productsfilter?page=" + page + "&status=" + status 
        );
        setProducts(res.data.items);
        setPageCount(res.data.pagination.countPage);
      } else {
        const ressult = await axios.get("/api/categories");
        setCategories(ressult.data);
        const res = await axios.get(
          "/api/productsfilter?page=" +
            page +
            "&category=" +
            catId +
            "&status=" +
            status +
            "&stocks="+
            stocks
        );
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
  }, [inputs, page, status, stocks,categoryName, catId]);

  const handleChanged = (value) => {
    setCatId((prev) => (prev === value ? "" : value));
    setPage(0)
  };

  const mainCats = categories.filter((c) => !c.parent);

  const handleChange = (e) => {
    setInputs(e.target.value);
  };
  return (
    <Layout>
      <div className="px-6 py-6 border rounded-md text-sm">
        <Link
          title="add new product"
          href="/products/new"
          className="bg-primary btn-primary"
        >
          Add new product
        </Link>
        <div className="my-5">
          <Search onChange={handleChange} />
        </div>
        <div className="w-full p-4 border rounded-md">
          <div className="flex gap-5 mt-2 mb-2 items-center w-full">
            <div className="w-full">
              <p>Categories</p>
              <div className="flex align-bottom gap-2">
                <select
                  required
                  value={catId}
                  onChange={(e) => handleChanged(e.target.value)}
                  className="rounded-md"
                >
                  <option title="all" value="all">
                    All
                  </option>
                  {mainCats.map((c) => (
                    <option required key={c.name} title={c.label} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-full">
              <div className="align-bottom gap-2">
                <p>Status</p>

                <select
                  required
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-md"
                >
                  {STATUS_FILTER.options.map((option, index) => (
                    <option
                      required
                      key={index}
                      title={option.label}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
         
          </div>
        </div>
        {isUploading && (
          <div className="flex justify-center">
            <BeatLoader />
          </div>
        )}
        {inputs.length > 2 ? (
          <>
            <TableProduct products={searchProducts} categories={categories} />
            <footer className="mt-5 flex gap-2 items-center justify-center">
              <button disabled={page === 0} onClick={handlePrevious}>
                <BsFillArrowLeftSquareFill size={24} color="gray" />
              </button>
              <div className="flex gap-1 text-gray-400">
                Page
                <p className="text-gray-500 font-bold">{page + 1}</p> of{" "}
                <p className="text-gray-500 font-bold">
                  {Math.ceil(pageCountS)}
                </p>
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
            <TableProduct products={products} categories={categories} />
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
      </div>
    </Layout>
  );
};

export default Products;
