"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PingContract = exports.BatteryContract = exports.contracts = void 0;
const batteryContract_1 = require("./contracts/batteryContract");
Object.defineProperty(exports, "BatteryContract", { enumerable: true, get: function () { return batteryContract_1.BatteryContract; } });
const ping_contract_1 = require("./contracts/ping-contract");
Object.defineProperty(exports, "PingContract", { enumerable: true, get: function () { return ping_contract_1.PingContract; } });
exports.contracts = [ping_contract_1.PingContract, batteryContract_1.BatteryContract]; // Asegura este orden
