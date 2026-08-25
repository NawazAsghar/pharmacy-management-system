import axios from 'axios';
import React, { useEffect, useState } from 'react'
import api from "../API";

export default function OrderStockList() {

    const [orders, setOrders] = useState([])

    const gettingData = async () => {
        const res = await api.get('/stockOrder/')
        setOrders(res.data)
    }

    useEffect(()=>{
        gettingData();
    },[])
  return (
    <div>
      <ul>
        <h1>Order list</h1>
        {orders.length < 1 && <p>No Orders yet</p>}
        {orders.map(order => (
          <div key={order.id}>  
            <h3>#{order.id} | Supplier: {order.supplier.username} | Status: {order.status}</h3>
            <ul>
              {order.items.map((item, idx)=>(
                <li>
                 item name:  {item.item} |
                 item stringth: {item.strength} |
                 item Quantity: {item.quantity}.</li>
              ))}
             </ul>
              <br /> <hr />
          </div>
        ))}
      </ul>
    </div>
  )
}
