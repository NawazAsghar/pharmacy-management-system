import axios from "axios"
import { useEffect, useState } from "react"
import api from "../API";

function Inventory() {

  const [inventoryItems, setInventoryItems] = useState([])

  const getInventoryItems = async () => {
    const res = await api.get('/inventory/')
    setInventoryItems(res.data)
  }

  useEffect(() => {
    getInventoryItems();
  }, [])

  return (
    <div>
      {/* 
      loops through each order in inventoryItems array and adds up them. 
      order.items.length: count how many items are inside this order then add it with 'total'
      (..., 0) start counting from 0 
      */}
      <p>Total items: {inventoryItems.reduce((total, order)=> total+order.items.length, 0)}</p>

      {inventoryItems.map(order => 
      order.items.map(item =>(
        <p key={item.id} >
          Name: {item.item} |Quantity: {item.quantity} | Rs: {item.item.item_price} | Supplier: {order.supplier.username}
        </p>
      ))
    )}
    </div>
  )
}

export default Inventory
