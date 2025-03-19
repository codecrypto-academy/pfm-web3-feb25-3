import { BatteryContract } from "./contracts/batteryContract";
import { PingContract } from "./contracts/ping-contract";

export const contracts: any[] = [PingContract, BatteryContract ]; // Asegura este orden

export { BatteryContract, PingContract };
