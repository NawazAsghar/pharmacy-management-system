import api from "../API";
import { useEffect, useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"


function StockOrder() {
  const { register, handleSubmit, control, reset } = useForm({
    // why should we set default values? 
    // useFieldArray needs something to .map() over on the first redner. It guarantee to show 1 row when the page loads.
    // {..., items[...]} -> name:"items" in useFieldArray must match defaultValues.items or RHF won't connect them.
    defaultValues: { supplier: '', items: [{ item: '', strength: '', quantity: '' }] }
  })

  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([]);
  // Dynamic Fields -> it gives user the option to add or remove fields base on their needs.
  // The name should be the same as the useFrom defaultValues {..., items:[...]}
  const { fields, append, remove } = useFieldArray({ control, name: "items" })

  // getting all the suppliers for the form dropdown menu 
  const getSuppliers = async () => {
    const res = await api.get('/suppliers/');
    setSuppliers(res.data);
  }

  useEffect(() => {
    getSuppliers();
  }, []);

  const handelSubmitFunc = async data => {
    try {

      const payload = {
        supplier: Number(data.supplier),
        status: data.status,

      /*
       Items will be stores in fields of useFieldArray hook. Then stored in form of list/array in form data. After that we iterate them one by one through map function. So we can create an array of item in items array

       useFieldArray manages dynamic item fields in the form.
       data.item is an array of objects from the form.
        we map over it to fromat each item before sending to the API.

      
       useFieldArray hook: We use this in the from to dynamically add/remove item rows.
       it gives us data.items = [{item: 'penadol', strength: 500, quantity: 5}, {another item, and so on...}]

       Build payload: The backed expects 1 Order object with a nested 'items' array.
       We can't send the array directly. We need to wrap it.

       data.items.map(): We loop through each row from useFieldArray.
       For each row we convert types: quantity to Numbers etc.
       type='number' in html/ReachHookFrom does not give you a number in from field.
       Even with the type='number' the browser gives you a string. it will always be e.traget.value "10", not 10.
       And React Hook Form by default also gives you string. data.quantity will be "10" not 10.

       Django will usually convet "10" to integer 10 but if we send "" or "abc" it will crash with 400 Bad request.
       This creates the final "items" array that matches the OrderItemSerializer 
       */

        items: data.items.map(item => ({
          item: item.item,
          strength: Number(item.strength),
          quantity: Number(item.quantity)
        }))
      }
      console.log(payload)
      const req = await api.post('/stockOrder/', payload)
      navigate('/OrderStockList/')
    }
    catch (e) {
      console.log(e.response.data)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(handelSubmitFunc)}>

        {/*Use field array is array of fields.
          When we click on Add item a new Field with empty values will be create in the form dynamically.
          `fields` is an array for objects. Each object = 1 row in the form. 
          We loop over `field` to render 1 set of input(means the div below with all the inputs will be create when we click on add-item button with empty values) for each item.
  
          register(`item.${index}.item`) means save this input's value inside data.items.[0].item
          When we submit, RHF gives us: data.items[{item, strength, quantity}, {...another item and so on...}]
  
          append() pushes a new empty object into `fields` array -> new row apears.
          remove(index) deletes that object from `fields` array. -> row with that index disappears */}
          
        {fields.map((field, index) => (
          <div key={field.id}>
            <input placeholder="Product name" {...register(`items.${index}.item`)} /> <br />
            <input placeholder="Strength"  {...register(`items.${index}.strength`, { valueAsNumber: true })} /> <br />
            <input placeholder="How many" type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} /> <br />
            {fields.length > 1 && (<button type="button" onClick={() => remove(index)}>Remove item</button>)}
          </div>
        ))}
        <br /><br />

        <button onClick={() => append({ item: '', strength: '', quantity: '' })}>Add item</button>

        <hr /><hr />
        <select {...register('supplier', { required: true, valueAsNumber: true })} defaultValue=''>
          <option value="" disabled> Select Supplier </option>
          {suppliers.map(sup => (
            <option key={sup.id} value={sup.id}> {sup.first_name} {sup.last_name}</option>
          ))}
        </select>
        {/* The default value is unEiditalbel */}
        <input placeholder="status" defaultValue={'RECEIVED'}  {...register('status')} readOnly /> <br />
        <button type="submit">Place order</button>
      </form>
      {/* After submiting the Form the page shuld redirect to the suppliers page where pharmasist can select whom to send this order  */}
    </div>
  )
}

export default StockOrder
