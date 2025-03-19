'use client';

import { ManufactureBattery } from "@/components/ManufactureBattery";
import Usuario from "../profile/page";
import { usePersistedState } from "@/app/hooks/usePersistedState";

export default function Factory() {
    const [stockCount, setStockCount] = usePersistedState('batteryStock', 0);

    const handleBatteryCreated = (quantity: number) => {
        setStockCount(prevStock => prevStock + quantity);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-white">Fábrica</h1>
            <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6 space-y-4">
                <div className="flex justify-between items-center">
                    <p>Consulta los envíos de fábrica</p>
                    <p>Stock: <span className="font-bold">{stockCount}</span> baterías</p>
                </div>
                <ManufactureBattery onBatteryCreated={handleBatteryCreated} />
            </div>
        </div>
    );
}
