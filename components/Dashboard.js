import React, { useEffect, useState } from "react";
import axios from "axios";
import { subHours } from "date-fns";

const Dashboard = () => {
    const [orders, setOrder] = useState([]);

    useEffect(() => {
     axios.get('/api/order').then(res => {
        setOrder(res.data);
     })
    }, [])

    const ordersToday = orders.filter(order => (
        new Date(order.createdAt) > subHours(new Date, 24)
    ))
    const ordersWeek = orders.filter(order => (
        new Date(order.createdAt) > subHours(new Date, 24*7)
    ))
    const ordersMonth = orders.filter(order => (
        new Date(order.createdAt) > subHours(new Date, 24*31)
    ))

    const ordersYear = orders.filter(order => (
      new Date(order.createdAt) > subHours(new Date, 24*365)
  ))
    
    function totalOrders (orders) {
        let sum = 0;
        orders.forEach(order => {
            order.line_items.forEach(item => {
              const itemSum =  item.quantity * item.price_data.unit_amount;
              sum += itemSum;
            })
        })
       
        return new Intl.NumberFormat('en-US').format(sum);
    }
  return (
    <div className="mt-5">
      <div className="text-xl">
        <h2>Orders</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-center font-bold">
          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> TODAY</h3>
            <h1 className="text-4xl text-center text-black my-2">{ordersToday.length}</h1>
            <p className="text-gray font-light">{ordersToday.length} orders today</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> THIS WEEK</h3>
            <h1 className="text-4xl text-center text-black my-2">{ordersWeek.length}</h1>
            <p className="text-gray font-light">{ordersWeek.length} orders this week</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> THIS MONTH</h3>
            <h1 className="text-4xl text-center text-black my-2">{ordersMonth.length}</h1>
            <p className="text-gray font-light">{ordersMonth.length} orders this month</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3>YEAR</h3>
            <h1 className="text-4xl text-center text-black my-2">{ordersYear.length}</h1>
            <p className="text-gray font-light">{ordersYear.length} orders</p>
          </div>

        </div>
      </div>

      <div className="text-xl mt-5">
        <h2>Revenue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5 text-center font-bold">
          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> TODAY</h3>
            <h1 className="text-4xl text-center text-black my-2">${totalOrders(ordersToday)}</h1>
            <p className="text-gray font-light">{ordersToday.length} orders today</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> THIS WEEK</h3>
            <h1 className="text-4xl text-center text-black my-2">${totalOrders(ordersWeek)}</h1>
            <p className="text-gray font-light">{ordersWeek.length} orders this week</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> THIS MONTH</h3>
            <h1 className="text-4xl text-center text-black my-2">${totalOrders(ordersMonth)}</h1>
            <p className="text-gray font-light">{ordersMonth.length} orders this month</p>
          </div>

          <div className="bg-white shadow-md p-4 text-gray-500 text-sm">
            <h3> YEAR</h3>
            <h1 className="text-4xl text-center text-black my-2">${totalOrders(ordersYear)}</h1>
            <p className="text-gray font-light">{ordersYear.length} orders</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
