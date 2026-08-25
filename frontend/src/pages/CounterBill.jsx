import axios from "axios"
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import api from "../API";
import { useNavigate } from "react-router-dom";

function CounterBill() {
  const { register, handleSubmit, control, reset } = useForm({
    // Same comment as StockOrder
    defaultValues: { pharmacist: '', items: [{ item: '', quantity: 1 }] }
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" })
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const formSubmit = async data => {
    try {
      const payload = {
        items: data.items.map(i => ({
          item_id: Number(i.item),
          quantity: Number(i.quantity)
        }))
      }
      
      const res = await api.post('/bill/', payload)
      const dataE = await res.data;
      navigate('/counterBill/')

    } catch (error) {
      console.log(error.response.data)
    }
  }

  const getItems = async () => {
    const res = await api.get('/items/') // change it to /inventory/
    setItems(res.data)
  }

  useEffect(() => {
    getItems();
  }, [])

  return (
    <div>
      <h1>Customer Bill</h1>
      <form onSubmit={handleSubmit(formSubmit)}>

        {/* <input type="number" placeholder="User" {...register("pharmacist")} /> */}
        {fields.map((field, index) => (
          <div key={field.key}>
            <select {...register(`items.${index}.item`)} defaultValue=''>
              <option value="" disabled> Select Item </option>
              {items.map(item => (
                <option key={item.id} value={item.id}> {item.name}</option>
              ))}
            </select>
            {/* <input placeholder="Seclect item" } /> */}
            <input type="number" placeholder="Quantity" {...register(`items.${index}.quantity`)} />
            {fields.length > 1 && <button onClick={() => remove(index)} >Remove item</button>}
          </div>
        ))}
        <br /> <hr /> <br />
        <button onClick={() => append()} >Add anoter item</button>
        <hr /><br />
        <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2">Add</button>
      </form>
    </div>
  )
}

export default CounterBill
