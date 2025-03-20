'use client';

import React, { useState, useRef } from 'react';

interface BuyBatteryProps {
    onBatteryBought: (boughtBatteries: { value: string, quantity: number }[]) => void;
}

interface Battery {
    id: number;
    label: string;
    value: string;
    price: number;
}

interface SelectedBattery {
    batteryValue: string;
    quantity: number;
}

export function BuyBattery({ onBatteryBought }: BuyBatteryProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [selectedBatteries, setSelectedBatteries] = useState<SelectedBattery[]>([]);

    const batteryTypes: Battery[] = [
        { id: 1, label: '502Ah-125Ah', value: '250-125', price: 600 },
        { id: 2, label: '243Ah-212Ah', value: '243-212', price: 500 },
        { id: 3, label: '214Ah-188Ah', value: '214-188', price: 400 },
        { id: 4, label: '143Ah', value: '143', price: 300 }
    ];

    const handleQuantityChange = (batteryValue: string, quantity: number) => {
        setSelectedBatteries(prev => {
            const existing = prev.find(b => b.batteryValue === batteryValue);
            if (existing) {
                return prev.map(b => 
                    b.batteryValue === batteryValue ? {...b, quantity} : b
                );
            }
            return [...prev, { batteryValue, quantity }];
        });
    };

    const handlePurchase = () => {
        if (selectedBatteries.length > 0) {
            onBatteryBought(selectedBatteries); // <--- Enviar todo el array
            dialogRef.current?.close();
            setSelectedBatteries([]);
        }
    };
    

    const handleCancel = () => {
        dialogRef.current?.close();
        setSelectedBatteries([]);
    };

    return (
        <div className="p-4">
            <button
                onClick={() => dialogRef.current?.showModal()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Comprar baterías
            </button>

            <dialog ref={dialogRef} className="modal rounded-lg p-6">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-4">Selecciona las baterías</h3>
                    <div className="grid gap-4">
                        {batteryTypes.map((battery) => {
                            const selected = selectedBatteries.find(b => b.batteryValue === battery.value);
                            return (
                                <div 
                                    key={battery.id} 
                                    className={`border p-4 rounded-lg ${
                                        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-semibold">{battery.label}</h4>
                                            <p className="text-gray-600">{battery.price}€</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="0"
                                                value={selected?.quantity || 0}
                                                onChange={(e) => {
                                                    const quantity = Math.max(0, parseInt(e.target.value) || 0);
                                                    if (quantity === 0) {
                                                        setSelectedBatteries(prev => 
                                                            prev.filter(b => b.batteryValue !== battery.value)
                                                        );
                                                    } else {
                                                        handleQuantityChange(battery.value, quantity);
                                                    }
                                                }}
                                                className="w-20 px-2 py-1 border rounded"
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    
                    {selectedBatteries.length > 0 && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Resumen de compra:</h4>
                            {selectedBatteries.map(selected => {
                                const battery = batteryTypes.find(b => b.value === selected.batteryValue);
                                return battery ? (
                                    <div key={battery.value} className="flex justify-between">
                                        <span>{battery.label}</span>
                                        <span>{selected.quantity} unidades</span>
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                    
                    <div className="modal-action mt-6">
                        <button 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                            onClick={handleCancel}
                        >
                            Cancelar
                        </button>
                        <button 
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
                            onClick={handlePurchase}
                            disabled={selectedBatteries.length === 0}
                        >
                            Confirmar compra
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}