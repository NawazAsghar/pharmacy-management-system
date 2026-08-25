import axios from "axios";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import api from "../API";

function Login() {
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()

    const onSubmitFunc = async (data) =>{
      try{
        // We just need to send the data(user cridentail to jwt if it's valid it will give us a token.)
        const req = await api.post('/token/', data)
        
        // W'll store that token in user browser memory with the key/name 'access'
        // localStorge = browser's storage. key='access', value=the token from server.
        localStorage.setItem('access', req.data.access)
        // Store the refrish token as well. Used to get a new access token when it expires.
        localStorage.setItem('refresh', req.data.refresh)

        navigate('/profile/')
        
      } catch(e){
        console.log("Unsuccessfly Login Attempt.")
      }
    } 
  
  return (
    <div>
        <h3>Login</h3>
      <form onSubmit={handleSubmit(onSubmitFunc)}>
        <input  placeholder="username" {...register('username')} />
        <input type="password" placeholder="Password" {...register('password')} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Login

