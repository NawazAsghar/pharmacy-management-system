'use client';
import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Select } from '@primereact/ui/select';
import { Divider } from '@primereact/ui/divider';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Trash } from '@primeicons/react/trash';
import { Plus } from '@primeicons/react/plus';
import api from '../API';

export default function StockOrder() {
    const navigate = useNavigate();
    const [suppliers, setSuppliers] = useState([]);
    const [isRolePharmcist, setPharmcistRole] = useState(false);

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            supplier: '',
            status:  'SENDED',
            items: [{ item: '', strength: '', quantity: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });

    const getSuppliers = async () => {
        try {
            const res = await api.get('/suppliers/');
            setSuppliers(res.data);
        } catch (e) {
            console.log('Failed to fetch suppliers');
        }
    };

    const getUser = async () => {
        const user = await api.get('/me/')
        
        if(user.data.role == 'PHARMACIST'){
            setPharmcistRole(true)
        }
    }

    useEffect(() => {
        getUser();
        getSuppliers();
    }, []);

    const handelSubmitFunc = async (data) => {
        try {
            const payload = {
                supplier_id: Number(data.supplier),
                status: data.status,
                items: data.items.map(item => ({
                    item: item.item,
                    strength: Number(item.strength),
                    quantity: Number(item.quantity),
                }))
            };
            await api.post('/stockOrder/', payload);
            
            navigate('/OrderStockList/');
        } catch (e) {
            console.log(e.response?.data);
        }
    };


    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
            <div className="w-full max-w-3xl space-y-6">

                {/* Page Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-slate-900">Place Stock Order</h1>
                    <p className="text-slate-500 text-sm">Fill in the details below to place a new stock order.</p>
                </div>

                <form onSubmit={handleSubmit(handelSubmitFunc)} className="space-y-6">

                    {/* Supplier & Status */}
                    <Card.Root>
                        <Card.Body className="space-y-4">
                            <Card.Caption>
                                <Card.Title>Order Details</Card.Title>
                                <Card.Subtitle>Select a supplier for this order.</Card.Subtitle>
                            </Card.Caption>
                            <Card.Content>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    {/* Supplier */}
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="supplier">Supplier</Label>
                                        <select
                                            id="supplier"
                                            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                                            defaultValue=""
                                            {...register('supplier', { required: true, valueAsNumber: true })}
                                        >
                                            <option value="" disabled>Select Supplier</option>
                                            {suppliers.map(sup => (
                                                <option key={sup.id} value={sup.id}>
                                                    {sup.first_name} {sup.last_name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.supplier && (
                                            <span className="text-red-500 text-xs">Please select a supplier</span>
                                        )}
                                    </div>

                                    {/* Status */}
                                    { 
                                        isRolePharmcist? " ": 
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="status">Status</Label>
                                        <InputText
                                            id="status"
                                            className="w-full bg-slate-50 text-slate-500 cursor-not-allowed"
                                            {...register('status')}
                                        />
                                    </div>
                                    }

                                </div>
                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                    {/* Order Items */}
                    <Card.Root>
                        <Card.Body className="space-y-4">
                            <Card.Caption>
                                <Card.Title>Order Items</Card.Title>
                                <Card.Subtitle>Add the products you want to order.</Card.Subtitle>
                            </Card.Caption>
                            <Card.Content className="space-y-4">

                                {fields.map((field, index) => (
                                    <div key={field.id} className="space-y-3">

                                        {/* Item row header */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-slate-700">
                                                Item #{index + 1}
                                            </span>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    severity="danger"
                                                    variant="text"
                                                    iconOnly
                                                    rounded
                                                    onClick={() => remove(index)}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash className="size-4" />
                                                </Button>
                                            )}
                                        </div>

                                        {/* Item fields */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`item-${index}`}>Product Name</Label>
                                                <InputText
                                                    id={`item-${index}`}
                                                    placeholder="e.g. Paracetamol"
                                                    {...register(`items.${index}.item`, { required: true })}
                                                />
                                                {errors.items?.[index]?.item && (
                                                    <span className="text-red-500 text-xs">Required</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`strength-${index}`}>Strength (mg)</Label>
                                                <InputText
                                                    id={`strength-${index}`}
                                                    type="number"
                                                    placeholder="e.g. 500"
                                                    {...register(`items.${index}.strength`, { required: true, valueAsNumber: true })}
                                                />
                                                {errors.items?.[index]?.strength && (
                                                    <span className="text-red-500 text-xs">Required</span>
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                                                <InputText
                                                    id={`quantity-${index}`}
                                                    type="number"
                                                    placeholder="e.g. 100"
                                                    {...register(`items.${index}.quantity`, { required: true, valueAsNumber: true })}
                                                />
                                                {errors.items?.[index]?.quantity && (
                                                    <span className="text-red-500 text-xs">Required</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Divider between items */}
                                        {index < fields.length - 1 && (
                                            <div className="h-px bg-slate-100 w-full mt-2" />
                                        )}
                                    </div>
                                ))}

                                {/* Add item button */}
                                <Button
                                    type="button"
                                    severity="secondary"
                                    variant="outlined"
                                    className="w-full justify-center mt-2"
                                    onClick={() => append({ item: '', strength: '', quantity: '' })}
                                >
                                    <Plus className="size-4 mr-2" />
                                    Add Another Item
                                </Button>

                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

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
                            Place Order
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}