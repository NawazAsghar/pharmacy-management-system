import React, { useEffect } from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../API'

export default function PharmacistBills() {
    // Get the id from the url '/pharmacistBill_history/:id/' at the end of the url.
    const { id } = useParams();
    const [PharmacistBillsHistory, setPharmacistBillsHistory] = useState([]);

    const getPharmacistBills = async () => {
        // same a the SupplierHistory comment info
        const res = await api.get(`/bill/?pharmacist=${id}`)
        setPharmacistBillsHistory(res.data);
    }

    // same a the SupplierHistory comment info
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
        getPharmacistBills();
    }, [id])
    return (
        <div>
            <div>
                <h1>Preivus Orders with - {PharmacistBillsHistory[0]?.pharmacist_name.username} </h1>
                {PharmacistBillsHistory.map(bill => (
                    <div>
                        <h3> created: {formatDate(bill.created_at)} | total Amount: {bill.totalBill_amount} </h3>

                        {/* {order.items.map(item => (
                            <p>item: {item.item} | strength: {item.strength} | {item.quantity}</p>
                        ))} */}
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    )
}
