import React, { useEffect, useState } from 'react'
// import SupplierCard from '../components/SupplierCard'
import api from "../API";
import ProfileCard from '../components/ProfileCard'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])

  const getSuppliers = async () => {
    const req = await api.get('/suppliers/');
    setSuppliers(req.data);
  }

  useEffect(() => {
    getSuppliers();
  }, [])

  return (
    <div>
      <h1>Suppliers: </h1>
      {suppliers.map(supplier => <ProfileCard key={supplier.id} profile={supplier} />)}


    </div>
  )
}

export default Suppliers
