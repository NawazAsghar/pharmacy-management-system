import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import api from "../API";

function Drug_details() {

  // Get the id from the url 
  const {id} = useParams();
  const [product, setProduct] = useState([]);

  useEffect(()=>{
    const res = api.get(`/items/${id}`).then(res => {
      setProduct(res.data);
    })
  }, [id])

  return (
    <div>
        {/* <img src="" alt="Drug imge" /> */}
        <p>{product.name}</p>
        <p>{product.price}</p>
        <hr />
        <button>Packet size: 30 capsoles</button>
        <p>- 1 + </p>
        <button>Add to cart</button>
        <button>Buy Now</button>
        <hr />
        <h6>Product Ingredients</h6>
        <ul>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, ex!</li>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, ex!</li>
          <li>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Incidunt, ex!</li>
        </ul>
        <h6>Directions:</h6>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum soluta laudantium, quaerat cupiditate excepturi eaque esse iure quisquam nemo culpa!</p>


    </div>
  )
}

export default Drug_details
