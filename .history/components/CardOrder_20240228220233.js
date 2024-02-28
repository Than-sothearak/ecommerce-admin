import React, { useContext, useEffect } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { useState } from "react";
import { CartContext } from "../components/context/CartContext";
import axios from "axios";
import { Toast } from "./Toast";
export const CardOrder = () => {
  const { cartProducts, addProduct, removeProduct, clearCart } =
    useContext(CartContext);
  const [isClicked, setIsClicked] = useState(false);

  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
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
    }
  }, []);

  function increaseProduct(id) {
    addProduct(id);
  }

  function decreaseProduct(id) {
    removeProduct(id);
  }

  

  let subtotal = 0;
  for (const productId of cartProducts) {
    const price = products.find((p) => p._id == productId)?.price || 0;
    subtotal += Number(price.toFixed(2));
  }

 const handleClear = () => {
      clearCart()
      setProducts([])
 }

  function countQty(_id) {
    const c = cartProducts?.filter((id) => id === _id);
    return c.length;
  }
  
    // Function to update discount for a product
    const setDiscount = (productId, discount) => {
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === productId ? { ...product, discount } : product
        )
      );
    };

  const calculateTotalPrice = () => {
 
    let subtotal = 0;
    for (const productId of cartProducts) {

      if (products.find((p) => p._id == productId)?.discount) {
        const price = products.find((p) => p._id == productId)?.price 
        const discount = price - price * products.find(p => p._id == productId).discount / 100
        subtotal += Number(discount.toFixed(2))
      } else {
        const price = products.find((p) => p._id == productId)?.price || 0;
        subtotal += Number(price.toFixed(2))
      }
     
      
      
      ;

    }
    return Number(subtotal.toFixed(2));
  };
  
  const discount = subtotal - calculateTotalPrice();

  function eachItemtotalPrice(_id, price) {
    const totalPrice = cartProducts.filter((id) => id === _id);
    const total = totalPrice.length * price;
    
    return total;
  }

  const discountTotal = (_id, price, discount) => {
    const formattedNum = eachItemtotalPrice(_id, price)- (eachItemtotalPrice(_id, price) * discount) / 100
    return Number(formattedNum.toFixed(1))
  }
  
  async function handleProcess(event) {
    try {
      if (cartProducts?.length <= 0) {
        event.preventDefault();
        alert("No product");
      } else {
        await axios.post("/api/checkout", {
          name,
          email,
          city,
          phone,
          cartProducts,
          products,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <form
      className="border-slate-200 border "
      onSubmit={handleProcess}
    >
      <div className="shadow-sm p-4 grid grid-cols-2 gap-x-4">
        <div>
          <label>Customer name</label>
          <input
            required
            type="text"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            name="name"
          />
        </div>
        <div>
          <label>Customer phone number</label>
          <input
            required
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(ev) => setPhone(ev.target.value)}
            name="phone"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            required
            type="text"
            placeholder="Email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            name="email"
          />
        </div>

        <div>
          <label>City</label>
          <input
            required
            type="text"
            placeholder="City"
            value={city}
            onChange={(ev) => setCity(ev.target.value)}
            name="city"
          />
        </div>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <table className="table-auto">
          <thead className="border-b-2">
            <tr>
              <th>Product</th>
              <th className="w-48">Price</th>
              <th>Discount</th>
              <th className="w-28">Quantity</th>
            </tr>
          </thead>
          {!products?.length > 0 && (
            <tr className="border-b-2">
              <td colSpan={4} className="text-center p-10 italic text-muted">
                <p>No item</p>
              </td>
            </tr>
          )}

          <tbody>
            {products.map((p) => (
              <tr className="border-b-2" key={p._id}>
                <td className="flex items-center gap-x-4 font-medium">
                  <button>
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
                  {p.discount ?  discountTotal(p._id, p.price, p.discount) :
                    eachItemtotalPrice(p._id, p.price)}
                  </p>
                </td>
                <td className="p-4 w-[90px] text-center">
                  <input
                    placeholder="%"
                    onChange={e => setDiscount(p._id, parseInt(e.target.value))}
                  />
                </td>
                <td className="flex items-center justify-between my-4 px-4">
                  <button
                    type="button"
                    className="border border-slate-200 p-2 rounded-md"
                    onClick={() => decreaseProduct(p._id)}
                  >
                    -
                  </button>
                  <div>{countQty(p._id)}</div>
                  <button
                    type="button"
                    disabled={countQty(p._id) >= p.stock}
                    title={countQty(p._id) >= p.stock && "Out of stock"}
                    className={
                      (countQty(p._id) >= p.stock
                        ? "cursor-not-allowed text-slate-200"
                        : "cursor-pointer") +
                      " border border-slate-200 p-2 rounded-md"
                    }
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
              <td></td>
              <td className="text-end">
                <h2>${subtotal}</h2>
              </td>
            </tr>

            <tr className="border-b-2 h-10">
              <td>Discount</td>
              <td></td>
              <td></td>
              <td className="text-end">
                <h2>${ discount}</h2>
              </td>
            </tr>

            <tr className="text-xl font-bold">
              <td>Total</td>
              <td></td>
              <td></td>
              <td className="text-xl font-bold text-end">${calculateTotalPrice()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="p-4 flex justify-between gap-x-4">
        <button 
        type="button"
        onClick={handleClear}
        className="w-full p-4 bg-orange-400 rounded-md text-white">
          Clear
        </button>
        <button
          type="submit"
          className="w-full p-4 bg-green-500 rounded-md text-white"
        >
          Process
        </button>
      </div>
    </form>
  );
};
