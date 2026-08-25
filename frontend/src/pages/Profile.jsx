import api from "../API";
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export default function Profile() {
  const [ userData, setUserData ] = useState([]);
  const navigate = useNavigate()

  const getUser = async () => {
    try{
      const user = await api.get('/me/')
      setUserData(user.data);
    }
    catch(e){
      navigate('/login/')
    }
  }

  useEffect(() => {
    getUser();
  }, [])

  return (
    <div>
      <h1>{userData.role}</h1>
      <p>{userData.userId}</p>
      <p>{userData.first_name}</p>
      <p>{userData.email}</p>
    </div>
  )
}