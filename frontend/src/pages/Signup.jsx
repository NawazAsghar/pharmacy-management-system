import api from "../API";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

function Signup() {
    const {register, handleSubmit} = useForm()
    const navigate = useNavigate()

    const onSubmit =async (data) => {
        try{
          const req = await api.post('/signup/', data);
          navigate('/login')

        } catch(e){
          console.log("Signup unSuccessfull.\n")
        }

    }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
        <h3>Signup</h3>
        <input placeholder="first_name" {...register('first_name')} />
        <input placeholder="last_name" {...register('last_name')} />
        <input placeholder="Username" {...register('username')} />
        <input type="email" placeholder="email" {...register('email')} />
        <input placeholder="Enter role"{...register('role')} />
        <input type="number" placeholder="Enter phone no"{...register('phone')} />
        <input type="password" placeholder="Password"{...register('password')} />
        <input type="password" placeholder="Conform Password" {...register('password2')} />

        <button type="submit">Signup</button>
    </form>
  )
}

export default Signup
