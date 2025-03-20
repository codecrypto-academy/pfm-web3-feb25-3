'use client';

import { useState } from "react";
import { BuyBattery } from "@/components/BuyBattery";
import SoldBattery from "@/components/SoldBattery";
import Usuario from "../profile/page";

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

interface BatteryBoughtProps {
    value: string;
    quantity: number;
}

export default function Consumer() {
    const [batteries, setBatteries] = useState<Battery[]>([
        { id: 1, label: '502Ah-125Ah', value: '250-125', quantity: 0 },
        { id: 2, label: '243Ah-212Ah', value: '243-212', quantity: 0 },
        { id: 3, label: '214Ah-188Ah', value: '214-188', quantity: 0 },
        { id: 4, label: '143Ah', value: '143', quantity: 0 }
    ]);

    const handleBatteryBought = (boughtBatteries: BatteryBoughtProps[]) => {
        setBatteries(prev =>
            prev.map(battery => {
                const bought = boughtBatteries.find(b => b.value === battery.value);
                if (bought) {
                    return { ...battery, quantity: battery.quantity + bought.quantity };
                }
                return battery;
            })
        );
    };
    

    const handleBatterySold = (soldBatteries: SelectedBatteryWithQuantity[]) => {
        setBatteries(prev =>
            prev.map(battery => {
                const sold = soldBatteries.find(s => s.batteryId === battery.id);
                if (sold) {
                    return {
                        ...battery,
                        quantity: battery.quantity - sold.sellQuantity
                    };
                }
                return battery;
            })
        );
    };

    const getTotalStock = () => {
        return batteries.reduce((total, battery) => total + battery.quantity, 0);
    };

    return (
        <div className="space-y-4">
            <Usuario />
            <h1 className="text-2xl font-white">Consumidor</h1>
            <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="space-x-4">
                        <BuyBattery onBatteryBought={handleBatteryBought} />
                        <SoldBattery 
                            currentStock={batteries} 
                            onSell={handleBatterySold}
                        />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">
                            Stock de baterías: {getTotalStock()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
