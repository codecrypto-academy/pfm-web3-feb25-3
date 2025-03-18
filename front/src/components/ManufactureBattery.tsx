'use client';

import React, { useRef, useState } from 'react';

interface BatteryCapacityOption {
    id: number;
    label: string;
    value: string;
}

const capacityOptions: BatteryCapacityOption[] = [
    { id: 1, label: '250Ah-125Ah', value: '250-125' },
    { id: 2, label: '243Ah-212Ah', value: '243-212' },
    { id: 3, label: '214Ah-188Ah', value: '214-188' },
    { id: 4, label: '143Ah', value: '143' }
];

interface BatteryFormData {
    id?: string;
    serialNumber: string;
    capacity: string;  // Cambiado a string para manejar los rangos
    voltage: number;
    quantity: number;
}

interface ManufactureBatteryProps {
    onBatteryCreated: (quantity: number) => void;
}

export function ManufactureBattery({ onBatteryCreated }: ManufactureBatteryProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [formData, setFormData] = useState<BatteryFormData>({
        serialNumber: '',
        capacity: '',  // Valor inicial vacío para el select
        voltage: 0,
        quantity: 1
    });
    
    const [errors, setErrors] = useState<Partial<BatteryFormData>>({});
    const [showMessage, setShowMessage] = useState(false);
    const [createdBattery, setCreatedBattery] = useState<BatteryFormData | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'capacity' || name === 'serialNumber' ? value : Number(value)
        }));
    };

    const validateForm = () => {
        const newErrors: Partial<BatteryFormData> = {};
        if (!formData.serialNumber) newErrors.serialNumber = '';
        if (!formData.capacity) newErrors.capacity = '';  // Validación modificada
        if (formData.voltage <= 0) newErrors.voltage = 0;
        if (formData.quantity < 1) newErrors.quantity = 1;
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            setCreatedBattery({...formData});
            setShowMessage(true);
            
            // Notificar al componente padre sobre la nueva cantidad
            onBatteryCreated(formData.quantity);

            setTimeout(() => {
                dialogRef.current?.close();
                setShowMessage(false);
                setFormData({
                    serialNumber: '',
                    capacity: '',
                    voltage: 0,
                    quantity: 1
                });
            }, 3000);
        } catch (error) {
            console.error('Error al crear la batería:', error);
        }
    };

    return (
        <div>
            <button 
                onClick={() => dialogRef.current?.showModal()}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Fabricar baterías
            </button>

            <dialog ref={dialogRef} className="modal rounded-lg p-6 backdrop:bg-gray-800/50">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold">Nueva Batería</h3>
                    
                    <div>
                        <label className="block">Número de Serie</label>
                        <input 
                            type="text"
                            name="serialNumber"
                            value={formData.serialNumber}
                            onChange={handleInputChange}
                            className={`border rounded p-2 w-full ${errors.serialNumber ? 'border-red-500' : ''}`}
                        />
                        {errors.serialNumber && (
                            <p className="text-red-500 text-sm">El número de serie es requerido</p>
                        )}
                    </div>

                    <div>
                        <label className="block">Capacidad (Ah)</label>
                        <select
                            name="capacity"
                            value={formData.capacity}
                            onChange={handleInputChange}
                            className={`border rounded p-2 w-full ${errors.capacity ? 'border-red-500' : ''}`}
                        >
                            <option value="">Seleccione una capacidad</option>
                            {capacityOptions.map(option => (
                                <option key={option.id} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.capacity && (
                            <p className="text-red-500 text-sm">Debe seleccionar una capacidad</p>
                        )}
                    </div>

                    <div>
                        <label className="block">Voltaje</label>
                        <input 
                            type="number"
                            name="voltage"
                            value={formData.voltage}
                            onChange={handleInputChange}
                            className={`border rounded p-2 w-full ${errors.voltage ? 'border-red-500' : ''}`}
                        />
                        {errors.voltage && (
                            <p className="text-red-500 text-sm">El voltaje debe ser mayor a 0</p>
                        )}
                    </div>

                    <div>
                        <label className="block">Cantidad</label>
                        <input 
                            type="number"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleInputChange}
                            className={`border rounded p-2 w-full ${errors.quantity ? 'border-red-500' : ''}`}
                        />
                        {errors.quantity && (
                            <p className="text-red-500 text-sm">La cantidad debe ser al menos 1</p>
                        )}
                    </div>

                    {showMessage && createdBattery && (
                        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            <p className="font-bold">Batería fabricada correctamente</p>
                            <p className="text-sm">
                                Número de serie: {createdBattery.serialNumber}<br/>
                                Capacidad: {capacityOptions.find(opt => opt.value === createdBattery.capacity)?.label}<br/>
                                Voltaje: {createdBattery.voltage}V<br/>
                                Cantidad: {createdBattery.quantity} unidades
                            </p>
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button 
                            type="button"
                            onClick={() => dialogRef.current?.close()}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Crear
                        </button>
                    </div>
                </form>
            </dialog>
        </div>
    );
}