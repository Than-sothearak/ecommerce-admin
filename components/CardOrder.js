import React, { useContext, useEffect } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { TiDeleteOutline } from "react-icons/ti";
import { useState } from "react";
import { CartContext } from "../components/context/CartContext";
import axios from "axios";
export const CardOrder = () => {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [isClicked, setIsClicked] = useState(false);

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [country, setCountry] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (cartProducts?.length > 0) {
      axios.post("/api/cart", { id: cartProducts }).then((res) => {
        setProducts(res.data);
      });
    } else {
      setProducts([]);
    }
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window?.location.href.includes("success")) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function increaseProduct(id) {
    addProduct(id);
  }

  function decreaseProduct(id) {
    removeProduct(id);
  }

  const handleClick = (id) => {
    if (products.filter((p) => p._id === id)) {
      return c;
    }
  };

  let subtotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id == productId)?.price || 0;
    subtotal += price;
  }

  const total = subtotal || 0;

  return (
    <div className="border-slate-200 border h-[1080px]">
      <div className="h-12 shadow-sm"></div>
      <div className="p-4 flex flex-col gap-2">
        <table>
          <thead className="border">
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <td>

          </td>
          {!cartProducts?.length > 0 && (
            <td className="flex justify-center text center">
              <p>No items</p>
            </td>
          )}
          <tbody>
            {products.map((p) => (
              <tr className="border-b-2" key={p._id}>
                <td className="flex items-center gap-x-4 font-medium">
                  <button onClick={() => handleClick(p._id)}>
                    {isClicked ? <IoIosArrowForward /> : <IoIosArrowDown />}
                  </button>
                  <div className="border border-slate-200 rounded-md w-11 h-11">
                    <img src={p.images[0]} />
                  </div>
                  <p className="text-sm">{p.title}</p>
                </td>

                <td className="text-center">
                  <p>
                    $
                    {cartProducts.filter((id) => id === p._id).length * p.price}
                  </p>
                </td>
                <td className="flex items-center justify-between my-4">
                  <button
                    className="border border-slate-200 p-2 rounded-md"
                    onClick={() => decreaseProduct(p._id)}
                  >
                    -
                  </button>
                  <div>{cartProducts?.filter((id) => id === p._id).length}</div>
                  <button
                    className="border border-slate-200 p-2 rounded-md"
                    onClick={() => increaseProduct(p._id)}
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}

            <tr className="border-b-2 h-10">
              <td>Subtotal</td>
              <td></td>
              <td className="text-end">
                <h2>${subtotal}</h2>
              </td>
            </tr>

            <tr className="text-xl font-bold">
              <td>Total</td>
              <td></td>
              <td className="text-xl font-bold text-end">${total}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 flex justify-between gap-x-4">
        <button 
        className="w-full p-4 bg-orange-400 rounded-md text-white"
        onClick={{}}
        >Cancel</button>
        <button className="w-full p-4 bg-green-500 rounded-md text-white"
        onClick={{}}
        >Process</button>
      </div>
    </div>
  );
};
