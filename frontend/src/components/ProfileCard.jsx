import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProfileCard({ profile }) {
  const navigate = useNavigate();

  /*
  When this function calls, this will navigate us to the blow url with the 'id'
  We said, in App.jsx line 39. render a 'SupplierHistory' named component. when this url came with id.
  When this SupplierHistory element render we use useEffect to get data from the api url we will get that data we will store it in sate. then we will render it on the view port.
 */
  const RedirectToSupplierHistory = (id) => {

    navigate(`/supplierHistory/${id}`)
    // console.log(id)
  }
  const RedirectToPharmacistBillHistory = (id) => {
    navigate(`/pharmacistBill_history/${id}`)
    // console.log(id)
  }
  return (
    <div>
      {/* <img src="" alt="Profile Img" /> */}
      <h4>Name: {profile.first_name}</h4>
      <p>Address: {profile.email}</p>
      <p>contact: {profile.phone}</p>
      {profile.role === 'SUPPLIER' ? <button onClick={() => RedirectToSupplierHistory(profile.id)}>Supplier History</button> : <button onClick={() => RedirectToPharmacistBillHistory(profile.id)}>PharmacistBill History</button>}
    </div>
  )
}

export default ProfileCard
