import React, { useState } from "react";
import Link from "next/link";
import Layout from "@/components/Layout";
import { useEffect } from "react";
import axios from "axios";
import { BeatLoader } from "react-spinners";
import { BsFillArrowLeftSquareFill, BsFillArrowRightSquareFill, BsSearch } from "react-icons/bs";

const Products = ({}) => {
  const [products, setProducts] = useState([]);
  const [searchProducts, setSearchProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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
          setPageCountS(res.data.pagination.countPageS)
          setPage(0)
          setIsUploading(false);
        }
     
        );
      } 
      else  {
        const ressult = await axios.get("/api/categories");
        setCategories(ressult.data);
        const res = await axios.get("/api/products?page=" + page);
        setProducts(res.data.items);
        setPageCount(res.data.pagination.countPage)
      }
    } catch (err) {
      console.log = err;
    }
    setIsUploading(false);
  };
  const handleCategoryChange = async (categoryId) =>  {
    const params = new URLSearchParams();
    
    const catId = categories.filter((c) => c._id === categoryId)[0]?._id
    params.set("categories", catId);
  
    await axios.get('/api/products?' + params.toString())
      .then((response) => response.json())
      .then((data) => setProducts(data.items))
      .catch((error) => console.error('Error fetching products:', error));
   
  };
  function handlePrevious () {
   setPage((p) => {
    if( p === 0 ) return p;
    return p -1
   })
  }
  function handleNext () {
   setPage(p => {
    if (p === pageCount) return p;
    return p + 1
   })
  }
  function handleBackWard () {
    setPage(0)
  }

  function handleChange(categoryId) {
    setCatId(categoryId);
    setFiltersChanged(true);
  }


  useEffect(() => {
  
    fatchData();
   
  }, [inputs, page]);

  return (
    <Layout>
      <Link
        title="add new product"
        href="/products/new"
        className="bg-primary btn-primary"
      >
        Add new product
      </Link>
    
        
    
      <div className="my-2 flex border border-gray-300 justify-center items-center rounded-md">
        <input
          onChange={(e) => setInputs(e.target.value)}
          type="text"
          placeholder="search products"
          className="border-none outline-none bg-transparent"
        />
        <BsSearch className="mr-2" />
      </div>

      <div className="mt-2">
          <p>Category</p>
     
            <select onChange={(e) => handleCategoryChange(e.target.value)}>
              <option value='all'>all</option>
            {categories?.map((c) => (
              <option key={c.id} value={c._id}>{c.name}</option>
            ))}
          </select>
       
        </div>

      {isUploading && (
        <div className="flex justify-center">
          <BeatLoader />
        </div>
      )}
        {inputs.length > 2 ? (
          <>
          <table className="basic mt-2">
          <thead>
            <tr>
              <td className="font-bold">Product name</td>
  
              <td className="font-bold">Category</td>
            </tr>
          </thead>
          <tbody>
            {searchProducts.map((product, index) => (
              <tr title={product.title} key={index}>
                <td className="border">{product.title}</td>

                <td className="text-center h-8 border">
                  {categories.filter((c) => c._id == product.category)[0]?.name}
                  <td className="text-center">
                    <img src={product.images[0]} className="w-8 h-8" />
                  </td>
                </td>
                <td className="m-0-auto border">
                  <Link
                    className="bg-primary text-white text-sm py-1 px-2 rounded-sm inline-flex gap-1 mr-1"
                    title="Edit product"
                    href={"/products/edit/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                  <Link
                    className="bg-red-700 text-white text-sm py-1 px-2 rounded-sm inline-flex gap-1 mr-1"
                    title="Delete product"
                    href={"/products/delete/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          <footer className="mt-5 flex gap-2 items-center justify-center">
        <button disabled={ page === 0 } onClick={handlePrevious}><BsFillArrowLeftSquareFill size={24} color='gray'/></button>
        <div className="flex gap-1 text-gray-400">
          Page 
          <p className="text-gray-500 font-bold">{page +1}</p> of <p className="text-gray-500 font-bold">{Math.ceil(pageCountS)}</p></div>
        <button disabled={page === Math.ceil(pageCountS) - 1}onClick={handleNext}><BsFillArrowRightSquareFill size={24} color='gray' /></button>
      </footer>
          </>
        ) : (
 <>
          <table className="basic mt-2">
          <thead>
            <tr>
              <td className="font-bold">Product name</td>
              <td className="font-bold">Image</td>
              <td className="font-bold">Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr title={product.title} key={index}>
                <td className="border">{product.title}</td>

                <td className="text-center w-8 h-8 border">
                    <img src={product.images[0]} className="w-8 h-8" />
                </td>
                <td className="border">  {categories.filter((c) => c._id == product.category)[0]?.name}</td>
                <td className="m-0-auto border">
                  <Link
                    className="bg-primary text-white text-sm py-1 px-2 rounded-sm inline-flex gap-1 mr-1"
                    title="Edit product"
                    href={"/products/edit/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                      />
                    </svg>
                  </Link>
                  <Link
                    className="bg-red-700 text-white text-sm py-1 px-2 rounded-sm inline-flex gap-1 mr-1"
                    title="Delete product"
                    href={"/products/delete/" + product._id}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
          <footer className="mt-5 flex gap-2 items-center justify-between">
          <div className="flex gap-6">
        <button disabled={ page=== 0 } onClick={handlePrevious}><BsFillArrowLeftSquareFill size={32} color= {page === 0  ? '#DCDCDC' : '#808080'} /></button>
        <div className="flex gap-1 text-gray-400 items-center">
          Page 
          <p className="text-gray-500 font-bold">{page +1}</p> of <p className="text-gray-500 font-bold">{Math.ceil(pageCount)}</p></div>
        <button 
          disabled={page === Math.ceil(pageCount) - 1}onClick={handleNext}><BsFillArrowRightSquareFill size={32} color= {page === Math.ceil(pageCount) - 1 ? '#DCDCDC' : '#808080'} /></button>
        </div>
            <button onClick={handleBackWard}><p className="text-gray-700 hover:text-blue-500">Back to default page</p></button>
        
      </footer>
 </>
          
        )}
  
  
   
    </Layout>
  );
};

export default Products;