import Layout from "@/components/Layout";
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/order").then((res) => {
      setOrders(res.data);
    });
  }, [orders]);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Recipient</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{(new Date(order.createdAt)).toLocaleString()}
                </td>
                <td>
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
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
};

export default Orders;
