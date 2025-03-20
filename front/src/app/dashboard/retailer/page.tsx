'use client';

import { BuyBattery } from "@/components/BuyBattery";
import Usuario from "../profile/page";
import { useState } from "react";
import SoldBattery from "@/components/SoldBattery";


export default function Retailer() {
  const [purchasedBatteries, setPurchasedBatteries] = useState(0);

    const handleBatteryBought = (quantity: number) => {
        setPurchasedBatteries(prev => prev + quantity);
        console.log(`Se compraron ${quantity} baterías`);
    };

    return (
      <div className="space-y-4">
        <Usuario />
        <h1 className="text-2xl font-white">Minorista</h1>
            <div className="bg-[var(--dashboard-card)] rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <p>Gestión de compras de baterías</p>
                    <p>Stock de baterías compradas: <span className="font-bold">{purchasedBatteries}</span></p>
                </div>
                <BuyBattery onBatteryBought={handleBatteryBought} />
                <SoldBattery />
            </div>
      </div>
    );
  }
  