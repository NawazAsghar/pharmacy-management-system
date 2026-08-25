import { useEffect, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

import api from "../API";

function Home() {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    getData();
  }, [])

  const getData = async () => {
    const res = await api.get('/items/')
    setProducts(res.data)
  }

  return (
    <section>
      <h1>Products: </h1>
      <hr /><br /><br />
     <br /><br />
      {products.map(product => (
        <div onClick={() => { navigate(`/itemDetails/${product.id}`) }} key={product.id}>
          <img src={product.img} alt="Product image" />
          <p>{product.name}</p>
          <p>{product.price}</p>
        </div>
      ))}
    </section>

  )
}

export default Home
