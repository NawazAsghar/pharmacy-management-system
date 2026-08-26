'use client';
import { useEffect, useState, useRef } from 'react';
import { useFieldArray, useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button } from '@primereact/ui/button';
import { Card } from '@primereact/ui/card';
import { InputText } from '@primereact/ui/inputtext';
import { Label } from '@primereact/ui/label';
import { Plus } from '@primeicons/react/plus';
import { Trash } from '@primeicons/react/trash';
import { Receipt } from '@primeicons/react/receipt';
import api from '../API';

// ✅ Outside the main component — this is the key fix
function SearchableItemSelect({ items, value, onChange, quantityRef }) {
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);

    const filtered = items.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    const selectedItem = items.find(i => String(i.id) === String(value));

    const handleSelect = (item) => {
        onChange(String(item.id));
        setSearch('');
        setOpen(false);
        setTimeout(() => quantityRef?.current?.focus(), 50);
    };

    return (
        <div className="relative">
            <InputText
                value={open ? search : (selectedItem?.name || '')}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => {
                    setSearch('');
                    setOpen(true);
                }}
                onBlur={() => setTimeout(() => setOpen(false), 150)}
                placeholder="Search medicine..."
                className="w-full"
            />
            {open && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filtered.length === 0 ? (
                        <div className="px-3 py-4 text-sm text-slate-400 text-center">
                            No medicines found
                        </div>
                    ) : (
                        filtered.map(item => (
                            <div
                                key={item.id}
                                onMouseDown={() => handleSelect(item)}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 hover:text-teal-700 transition-colors
                                    ${String(item.id) === String(value) ? 'bg-teal-50 text-teal-700 font-medium' : 'text-slate-700'}`}
                            >
                                {item.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

// ✅ Main component
export default function CounterBill() {
    const { register, handleSubmit, control, watch,reset, formState: { errors } } = useForm({
        defaultValues: {
            items: [{ item: '', quantity: '' }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'items' });
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const watchedItems = watch('items');
    const quantityRefs = useRef([]); // ✅ single ref array outside map

    const getItems = async () => {
        try {
            const res = await api.get('/items/');
            setItems(res.data);
        } catch (e) {
            console.log('Failed to fetch items');
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const formSubmit = async (data) => {
        try {
            const payload = {
                items: data.items.map(i => ({
                    item_id: Number(i.item),
                    quantity: Number(i.quantity)
                }))
            };
            await api.post('/bill/', payload);
            reset();
        } catch (error) {
            console.log(error.response?.data);
        }
    };

    const getItemDetails = (itemId) => {
        return items.find(i => i.id === Number(itemId));
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-start justify-center p-6">
            <div className="w-full max-w-3xl space-y-6">

                {/* Page Header */}
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-teal-50 flex items-center justify-center">
                        <Receipt className="size-5 text-teal-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Counter Bill</h1>
                        <p className="text-slate-500 text-sm">Create a new customer bill</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(formSubmit)} className="space-y-6">
                    <Card.Root>
                        <Card.Body className="space-y-4">
                            <Card.Caption>
                                <Card.Title>Bill Items</Card.Title>
                                <Card.Subtitle>Search and select items for this bill.</Card.Subtitle>
                            </Card.Caption>
                            <Card.Content className="space-y-4">

                                {fields.map((field, index) => {
                                    const selectedItem = getItemDetails(watchedItems?.[index]?.item);
                                    return (
                                        <div key={field.id} className="space-y-3">

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
                                                    >
                                                        <Trash className="size-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                <div className="flex flex-col gap-2">
                                                    <Label>Medicine / Product</Label>
                                                    <Controller
                                                        control={control}
                                                        name={`items.${index}.item`}
                                                        rules={{ required: true }}
                                                        render={({ field: controllerField }) => (
                                                            <SearchableItemSelect
                                                                items={items}
                                                                value={controllerField.value}
                                                                onChange={controllerField.onChange}
                                                                quantityRef={{
                                                                    current: quantityRefs.current[index]
                                                                }}
                                                            />
                                                        )}
                                                    />
                                                    {errors.items?.[index]?.item && (
                                                        <span className="text-red-500 text-xs">Please select an item</span>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                                                    <InputText
                                                        id={`quantity-${index}`}
                                                        ref={(el) => (quantityRefs.current[index] = el)}
                                                        type="number"
                                                        placeholder="e.g. 2"
                                                        {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                                                    />
                                                    {errors.items?.[index]?.quantity && (
                                                        <span className="text-red-500 text-xs">Enter a valid quantity</span>
                                                    )}
                                                </div>
                                            </div>

                                            {selectedItem && (
                                                <div className="bg-teal-50 border border-teal-100 rounded-lg px-4 py-2 flex items-center gap-4 text-sm">
                                                    <span className="text-teal-700 font-medium">{selectedItem.name}</span>
                                                    {selectedItem.price && (
                                                        <span className="text-teal-600">
                                                            Price: <strong>Rs. {selectedItem.price}</strong>
                                                        </span>
                                                    )}
                                                    {selectedItem.stock && (
                                                        <span className="text-teal-600">
                                                            In stock: <strong>{selectedItem.stock}</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {index < fields.length - 1 && (
                                                <div className="h-px bg-slate-100 w-full mt-2" />
                                            )}
                                        </div>
                                    );
                                })}

                                <Button
                                    type="button"
                                    severity="secondary"
                                    variant="outlined"
                                    className="w-full justify-center mt-2"
                                    onClick={() => append({ item: '', quantity: '' })}
                                >
                                    <Plus className="size-4 mr-2" />
                                    Add Another Item
                                </Button>

                            </Card.Content>
                        </Card.Body>
                    </Card.Root>

                    {/* Summary Card */}
                    {watchedItems?.some(i => i.item && i.quantity) && (
                        <Card.Root>
                            <Card.Body>
                                <Card.Caption>
                                    <Card.Title>Bill Summary</Card.Title>
                                </Card.Caption>
                                <Card.Content>
                                    <div className="space-y-2">
                                        {watchedItems.map((i, idx) => {
                                            const detail = getItemDetails(i.item);
                                            if (!detail || !i.quantity) return null;
                                            return (
                                                <div key={idx} className="flex items-center justify-between text-sm py-1">
                                                    <span className="text-slate-700">{detail.name} × {i.quantity}</span>
                                                    {detail.price && (
                                                        <span className="font-semibold text-slate-900">
                                                            Rs. {(detail.price * i.quantity).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                        {watchedItems.some(i => getItemDetails(i.item)?.price) && (
                                            <>
                                                <div className="h-px bg-slate-200 my-2" />
                                                <div className="flex items-center justify-between font-bold text-sm">
                                                    <span className="text-slate-900">Total</span>
                                                    <span className="text-teal-700 text-base">
                                                        Rs. {watchedItems.reduce((sum, i) => {
                                                            const detail = getItemDetails(i.item);
                                                            if (!detail?.price || !i.quantity) return sum;
                                                            return sum + (detail.price * Number(i.quantity));
                                                        }, 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </Card.Content>
                            </Card.Body>
                        </Card.Root>
                    )}

                    <div className="flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            severity="secondary"
                            variant="outlined"
                            onClick={() => navigate('/counterBill/')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit">
                            <Receipt className="size-4 mr-2" />
                            Generate Bill
                        </Button>
                    </div>

                </form>
            </div>
        </div>
    );
}