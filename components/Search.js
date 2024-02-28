import React from 'react'
import {
    BsSearch,
  } from "react-icons/bs";

  export const Search = ({onChange}) => {
  return (
    <div className="flex border w-full border-gray-300 justify-center items-center rounded-md">
    <input
      onChange={onChange}
      type="text"
      placeholder="search products"
      className="w- full border-none outline-none bg-transparent"
    />
    <BsSearch className="mr-4" />
  </div>
  )
}
