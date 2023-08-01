import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";
import { BeatLoader } from "react-spinners";

const Orders = ({swal}) => {
  const [orders, setOrders] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  
  async function fetchOrderData () {
    setIsUploading(true)
    await axios.get("/api/order").then((res) => {
      setOrders(res.data);
    }
   
    )
    setIsUploading(false);
  }
  useEffect(() => {
    fetchOrderData ();
  }, []);

  function deleteCategory(order) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete ${order._id}?`,
        showCancelButton: true,
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        cancelButtonText: "Cancel",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = order;
          await axios.delete("/api/order?_id=" + _id);
          fetchOrderData();
        }
      });
  }


  return (
    <Layout>
      <h1>Orders</h1>
      {isUploading && (
        <div className="flex justify-center">
          <BeatLoader />
        </div>
      )}
      <table className="basic">
        <thead className="border ">
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody className="border">
        {!orders?.length > 0 && <div className="p-3 text-center">Your order is empty</div>}

          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id} className="border">
                <td className="border">{(new Date(order.createdAt)).toLocaleString()}
                </td>
                <td className="border">
                  {order.name}, {order.email}, {order.city}, <br />{order.streetAddress}
                  , {order.postalCode}, {order.country} <br />
                </td>
                <td>
                 
                  {order.line_items.map(line => (
                    <>
                   {line.price_data?.product_data?.name} x  
                   {line.quantity} <br />
                    {/* {JSON.stringify(line)} */}
                    </>
                  ))}
                </td>
                <button
                      title="Remove document"
                      onClick={() => deleteCategory(order)}
                      className="flex btn-delete gap-1 mr-1 items-center mt-4"
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
                   
                    </button>
              </tr>
              
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default withSwal(({ swal }, ref) => <Orders swal={swal} />);
