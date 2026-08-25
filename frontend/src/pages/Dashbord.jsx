import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Inventory from './Inventory'
import StockOrder from './StockOrder'
import Supliers from './Supliers'
import SupplierHistory from './SupplierHistory'
import TotalBills from './TotalBills'
import Pharmacist from './Pharmacist'
import CounterBill from './CounterBill'
import api from '../API'
import { useNavigate } from 'react-router-dom'

function Dashbord() {

  const [todaySale, setTodaySale] = useState(0);
  const [ExpiryItems, setExpiryItems] = useState([]);
  const [todayOrders, settodayOrders] = useState([]);
  const navigate = useNavigate();

  const getTodaySale = async () => {
    const res = await api.get('/bill/')
    let data = res.data
    let totalAmount = 0;
    data.forEach(item => {
      totalAmount += item.totalBill_amount;
    });
    setTodaySale(totalAmount)
  }

  const getItmeWithNearExpiry = async () => {
    const res = await api.get('/batch/')
    setExpiryItems(res.data)
  }

  const getTodayOrders = async () => {
    const res = await api.get('/todayOrders/')
    settodayOrders(res.data)
    console.log(res.data)
  }


  useEffect(() => {
    getTodaySale();
    getItmeWithNearExpiry();
    getTodayOrders();
  }, [])

  return (
    <section>
      <h4>Daily Sale: RS: {todaySale} </h4>
      <hr />
      <h4>Expirring Items:</h4>
      {ExpiryItems.map(batch => (
        batch.item_set.map(item => (
          <p key={item.id}>
            item: {item.name} | expiry: {batch.expiry_date}
          </p>
        ))
      ))}
      <hr />
      <h4>Today Order: {todayOrders.length}</h4>
      {todayOrders.map(order => (
        <div>
          <p key={order.id}>Order #: {order.id} | supplier:  {order.supplier.username} </p>
        {order.items.map(item =>(
          <p key={item.id} >name: {item.item} | Quantity: {item.quantity}</p>
          ))}
        </div>
      ))}

      <button onClick={()=>{navigate('/inventory/')}}>Check Out Inventory</button>

      <br /><br />

      <button onClick={()=>{navigate('/orderStockList/')}}>All stock orders</button>

      <br /> <br />
      <button onClick={()=>{navigate('/suppliers/')}}>Suppliers</button>

      <br /> <br />
      <button onClick={()=>{navigate('/totalBills/')}}>All counter bills</button>

      <br /> <br />
      <button onClick={()=>{navigate('/pharmacists/')}}>Pharmacist</button>

    </section>
  )
}

export default Dashbord
