import React, { useEffect, useState } from 'react'
import ProfileCard from '../components/ProfileCard'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import api from "../API";

function Pharmacist() {
  const [pharmacists, setPharmacist] = useState([]);
  const navigate = useNavigate();

  const getPharmacist = async () => {
    const res = await  api.get('/pharmacist_viewset/')
    setPharmacist(res.data)
  }

  useEffect(()=>{
    getPharmacist();
  },[])

  const handleClick = () => {
    navigate('/signup/')
  }
  return (
    <div>
      <h1>All the Pharmacist</h1>
      <br /> <br /> <br />

      {pharmacists.map(pharmacist => <ProfileCard key={pharmacist.id}  profile={pharmacist} />)}

      <button onClick={handleClick} className='bg-blue-600 text-white rounded-lg px-4 py-2'>Add Pharmacist</button>
    </div>
  )
}

export default Pharmacist
