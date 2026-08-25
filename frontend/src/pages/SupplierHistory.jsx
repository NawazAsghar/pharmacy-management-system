import api from "../API";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function SupplierHistory() {
  // Get the id from the url 
  const { id } = useParams();
  const [supplierHistory, setSupplierHistory] = useState([]);

  const getSupplierHistory = async () => {
    // /?supplier=${id} -> this is the special url for django filter backend.
    // 'supplier' is filterset_fields name "filterset_fields = ['supplier']" in view.
    // ${id} -> we will get it from the url by '{ id } = useParams()' useParams hook.
    const res = await api.get(`/suppliersHistory/?supplier=${id}`);
    setSupplierHistory(res.data)
    // console.log(res.data)

  }

  // To show the created_at date and time in will structured way 
  const formatDate = dateStr => {
    return new Date(dateStr).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  useEffect(() => {
    getSupplierHistory();
  }, [id])
  return (
    <div>
      <h1>Preivus Orders with - {supplierHistory[0]?.supplier.username} </h1>
      {supplierHistory.map(order => (
        <div>
          <h3> created:{formatDate(order.created_at)} | status: {order.status} </h3>

          {order.items.map(item => (
            <p>item: {item.item} | strength: {item.strength} | {item.quantity}</p>
          ))}
          <hr />
        </div> 
      ))}
    </div>
  )
}

export default SupplierHistory
