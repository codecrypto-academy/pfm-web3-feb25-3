"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatteryStatus = exports.Battery = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
let Battery = class Battery {
    constructor() {
        this.id = ''; // ID único de la batería
        this.serialNumber = ''; // Número de serie de la batería
        this.capacity = ''; // Capacidad en kWh
        this.manufacturerId = ''; // ID del fabricante
        this.currentOwnerId = ''; // ID del propietario actual
        this.status = ''; // Estado de la batería
        this.location = ''; // Ubicación actual
    }
};
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "docType", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "id", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "serialNumber", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "capacity", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "manufacturerId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "currentOwnerId", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "status", void 0);
__decorate([
    (0, fabric_contract_api_1.Property)(),
    __metadata("design:type", String)
], Battery.prototype, "location", void 0);
Battery = __decorate([
    (0, fabric_contract_api_1.Object)()
], Battery);
exports.Battery = Battery;
var BatteryStatus;
(function (BatteryStatus) {
    BatteryStatus["MANUFACTURED"] = "Manufactured";
    BatteryStatus["IN_TRANSIT"] = "In Transit";
    BatteryStatus["RECEIVED"] = "Received";
    BatteryStatus["SOLD"] = "Sold";
})(BatteryStatus = exports.BatteryStatus || (exports.BatteryStatus = {}));
