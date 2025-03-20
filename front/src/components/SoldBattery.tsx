'use client';

import React, { useState, useEffect } from 'react';

interface SoldBatteryProps {
    currentStock: Battery[];
    onSell: (soldBatteries: SelectedBatteryWithQuantity[]) => void;
}

interface Battery {
    id: number;
    label: string;
    value: string;
    quantity: number;
}

interface SelectedBatteryWithQuantity {
    batteryId: number;
    sellQuantity: number;
}

const SoldBattery: React.FC<SoldBatteryProps> = ({ currentStock, onSell }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedBatteries, setSelectedBatteries] = useState<SelectedBatteryWithQuantity[]>([]);
    const [batteries, setBatteries] = useState<Battery[]>([]);

    useEffect(() => {
        if (currentStock && currentStock.length > 0) {
            setBatteries(currentStock);
        }
    }, [currentStock]);

    const handleQuantityChange = (batteryId: number, quantity: number) => {
        const battery = batteries.find(b => b.id === batteryId);
        if (!battery) return;

        const validQuantity = Math.min(Math.max(1, quantity), battery.quantity);

        setSelectedBatteries(prev => {
            const existing = prev.find(b => b.batteryId === batteryId);
            if (existing) {
                return prev.map(b =>
                    b.batteryId === batteryId
                        ? { ...b, sellQuantity: validQuantity }
                        : b
                );
            }
            return [...prev, { batteryId, sellQuantity: validQuantity }];
        });
    };

    const handleToggleSelection = (batteryId: number) => {
        setSelectedBatteries(prev => {
            const isSelected = prev.some(b => b.batteryId === batteryId);
            if (isSelected) {
                return prev.filter(b => b.batteryId !== batteryId);
            }
            return [...prev, { batteryId, sellQuantity: 1 }];
        });
    };

    const handleSell = () => {
        if (selectedBatteries.length > 0) {
            onSell(selectedBatteries);
            setShowModal(false);
            setSelectedBatteries([]);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setSelectedBatteries([]);
    };

    return (
        <div className="sold-battery-container">
            <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={!batteries.some(b => b.quantity > 0)}
            >
                Vender baterías
            </button>

            {showModal && batteries.length > 0 && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-96">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Stock de Baterías</h3>
                        <div className="space-y-3">
                            {batteries.map(battery => {
                                const selected = selectedBatteries.find(s => s.batteryId === battery.id);
                                return (
                                    <div
                                        key={battery.id}
                                        className={`p-4 border rounded-lg transition-all ${
                                            selected
                                                ? 'bg-blue-100 border-blue-500'
                                                : 'hover:bg-gray-50 border-gray-200'
                                        } ${battery.quantity === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        onClick={() => battery.quantity > 0 && handleToggleSelection(battery.id)}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-800">{battery.label}</p>
                                                <p className="text-sm text-gray-600">Capacidad: {battery.value}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-800">{battery.quantity}</p>
                                                <p className="text-sm text-gray-600">disponibles</p>
                                            </div>
                                        </div>
                                        {selected && (
                                            <div className="mt-3 flex items-center justify-end space-x-2">
                                                <label className="text-sm text-gray-600">Cantidad a vender:</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max={battery.quantity}
                                                    value={selected.sellQuantity}
                                                    onChange={(e) => handleQuantityChange(battery.id, parseInt(e.target.value) || 1)}
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="w-20 px-2 py-1 border rounded text-right"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSell}
                                disabled={selectedBatteries.length === 0}
                                className={`px-4 py-2 rounded ${
                                    selectedBatteries.length === 0
                                        ? 'bg-blue-300 cursor-not-allowed'
                                        : 'bg-blue-500 hover:bg-blue-700 text-white'
                                }`}
                            >
                                Vender
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SoldBattery;