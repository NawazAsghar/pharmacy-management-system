'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Label } from '@primereact/ui/label';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';
import { InputText } from '@primereact/ui/inputtext';
import api from '../API';

const statusSeverity = (status) => {
    switch (status) {
        case 'RECEIVED': return 'success';
        case 'DELIVERED': return 'info';
        case 'SENDED': return 'warn';
        default: return 'secondary';
    }
};

export default function OrderStatusUpdate() {
    const navigate = useNavigate();
    const { id } = useParams()
    const [order, setOrder] = useState([])
    const [currentUser, setCurrentUser] = useState([])

    const { register, handleSubmit } = useForm({
        defaultValues: {
            status: order?.status || '',
        }
    })

    const getUser = async () => {
        try {
            const res = await api.get("/me/");
            setCurrentUser(res.data);
        } catch (e) {
            console.error("Authentication failed or session expired", e);
            navigate("/login/");
        }
    };

    const handelSubmitFunc = async (data) => {
        try {
            await api.patch(`/stockOrder/${id}/`, data);

            navigate('/OrderStockList/');
        } catch (e) {
            console.log(e.response?.data);
        }
    };

    const Statuses = [
        "PACKING",
        "DELIVERED",
    ]

    const fetchOrder = async () => {
        const res = await api.get(`/stockOrder/${id}/`);
        setOrder(res.data)
    }

    useEffect(() => {
        fetchOrder();
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
            <div className="w-full max-w-3xl space-y-6">

                {/* Page Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900">Update Order status</h1>
                </div>

                <form onSubmit={handleSubmit(handelSubmitFunc)} className="space-y-6">

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="status">Status</Label>
                        <select
                            id="status"
                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                            {...register('status')}
                        >
                            <option value="" disabled>{order.status}</option>
                            {
                                currentUser.role === 'SUPPLIER' ?
                                    Statuses.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    )) :
                                    <option  value='RECEIVED'>
                                        RECEIVED
                                    </option>
                            }
                        </select>
                    </div>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            severity="secondary"
                            variant="outlined"
                            onClick={() => navigate('/OrderStockList/')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            Update Status
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}