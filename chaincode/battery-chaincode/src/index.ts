import { BatteryContract } from "./contracts/batteryContract";
import { PingContract } from "./contracts/ping-contract";

export const contracts: any[] = [ BatteryContract, PingContract ]; // Asegura este orden

export { BatteryContract, PingContract };
