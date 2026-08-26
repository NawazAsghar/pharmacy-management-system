'use client';
import { use, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';
import { Badge } from '@primereact/ui/badge';
import { Plus } from '@primeicons/react/plus';
import { ShoppingCart } from '@primeicons/react/shopping-cart';
import api from '../API';

const statusSeverity = (status) => {
    switch (status) {
        case 'RECEIVED': return 'success';
        case 'DELIVERED': return 'info';
        case 'SENDED': return 'warn';
        default: return 'secondary';
    }
};

export default function OrderStockList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    // const [status, setStatus] = useState([])
    const navigate = useNavigate();

    const handleStatusChange = (id)=>{
        navigate(`/updateStatus/${id}`)
    }

    useEffect(() => {
        const fetchUserDataAndOrders = async () => {
            const token = localStorage.getItem('access');
            if (!token) {
                setCurrentUser(null);
                setLoading(false);
                return;
            }

            try {
                // 1. Get user details first
                const userRes = await api.get('/me/');
                const user = userRes.data; // Store in local variable
                setCurrentUser(user);

                if (user?.role === 'PHARMACIST') {
                    const res = await api.get('/stockOrder/');
                    setOrders(res.data);
                } else if (user?.role === 'SUPPLIER') {
                    const res = await api.get(`/suppliersHistory/?supplier=${user.userId}`);
                    setOrders(res.data);
                }
            } catch (err) {
                console.error('Failed to fetch user or orders:', err);
                setCurrentUser(null);
            } finally {
                // 3. Always stop loading when done
                setLoading(false);
            }
        };

        fetchUserDataAndOrders();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-4xl mx-auto space-y-6">

                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold text-slate-900">Stock Orders</h1>
                        <p className="text-slate-500 text-sm">
                            {orders.length} order{orders.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    {currentUser?.role === 'PHARMACIST' ?
                        <Button onClick={() => navigate('/stockOrder/')}>
                            <Plus className="size-4 mr-2" />
                            New Order
                        </Button>
                        : ''}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <span className="text-slate-400 text-sm">Loading orders...</span>
                    </div>
                )}

                {/* Empty state */}
                {!loading && orders.length === 0 && (
                    <Card.Root>
                        <Card.Body>
                            <Card.Content className="flex flex-col items-center justify-center py-16 space-y-4">
                                <div className="size-16 rounded-full bg-slate-100 flex items-center justify-center">
                                    <ShoppingCart className="size-8 text-slate-400" />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="font-semibold text-slate-700">No orders yet</p>
                                    <p className="text-sm text-slate-400">Place your first stock order to get started.</p>
                                </div>
                                <Button onClick={() => navigate('/stockOrder/')}>
                                    <Plus className="size-4 mr-2" />
                                    Place Order
                                </Button>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>
                )}

                {/* Orders list */}
                {!loading && orders.map(order => (
                    <Card.Root key={order.id}>
                        <Card.Body className="space-y-4">

                            {/* Order header */}
                            <Card.Content>
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="size-10 rounded-full bg-teal-50 flex items-center justify-center">
                                            <ShoppingCart className="size-5 text-teal-600" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900">
                                                Order #{order.id}
                                            </p>
                                            <p className="text-sm text-slate-500">
                                                Supplier: <span className="font-medium text-slate-700">{order.supplier.username}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge severity={statusSeverity(order.status)}>
                                            {order.status}
                                        </Badge>
                                        <span className="text-xs text-slate-400">
                                            {order.created_at}
                                        </span>
    
                                        {currentUser.role === 'PHARMACIST' & order.status === 'DELIVERED'?
                                        <button
                                            onClick={() => handleStatusChange(order.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                        >
                                            Change Status
                                        </button>: ''}
                                        {currentUser.role === 'SUPPLIER' & order.status != 'DELIVERED' & order.status != 'RECEIVED'?
                                        <button
                                            onClick={() => handleStatusChange(order.id)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
                                        >
                                            Change Status
                                        </button>: ""}
                                        
                                    </div>
                                </div>
                            </Card.Content>

                            {/* Divider */}
                            <div className="h-px bg-slate-100 mx-4" />

                            {/* Items table */}
                            <Card.Content>
                                <div className="w-full">

                                    {/* Table header */}
                                    <div className="grid grid-cols-3 gap-4 px-3 py-2 bg-slate-50 rounded-lg mb-2">
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</span>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Strength</span>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantity</span>
                                    </div>

                                    {/* Table rows */}
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`grid grid-cols-3 gap-4 px-3 py-3 rounded-lg ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                                        >
                                            <span className="text-sm font-medium text-slate-800">{item.item}</span>
                                            <span className="text-sm text-slate-600">{item.strength} mg</span>
                                            <span className="text-sm text-slate-600">{item.quantity} units</span>
                                        </div>
                                    ))}

                                </div>
                            </Card.Content>

                            {/* Footer */}
                            <div className="flex items-center justify-between px-4 pb-2">
                                <span className="text-xs text-slate-400">
                                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} in this order
                                </span>
                            </div>

                        </Card.Body>
                    </Card.Root>
                ))}

            </div>
        </div>
    );
}