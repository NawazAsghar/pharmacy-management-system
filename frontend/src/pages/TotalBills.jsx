import { useEffect, useState } from "react"
import api from "../API"

function TotalBills() {

  const [totalBills, setTotalBills] = useState([])

  const getAllBills = async () => {
    const res = await api.get('/bill/')
    setTotalBills(res.data)
  }

  // for formating the bill created_at date time.
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
    getAllBills();
  }, [])

  return (
    <div>
      <h1>All bills</h1>

      {totalBills.map(bill => (
        <div>
          <h4 key={bill.id}> {bill.id}  | {formatDate(bill.created_at)}  |  {bill.pharmacist_name.username}  | {bill.totalBill_amount}</h4>


          {bill.items.map(item => (
            <p>{item.item.name} | RS: {item.item.price} | {item.quantity} | total price: {item.item.price * item.quantity}</p>

          ))}
          <hr /><br />
        </div>
      ))}
    </div>
  )
}

export default TotalBills
