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
exports.BatteryContract = void 0;
const fabric_contract_api_1 = require("fabric-contract-api");
const battery_1 = require("../domain/battery");
const accessControl_1 = require("../accessControl");
let BatteryContract = class BatteryContract extends fabric_contract_api_1.Contract {
    async registerBattery(ctx, id, capacity) {
        const manufacturer = ctx.clientIdentity.getID(); // Ethereum Address del fabricante
        const role = ctx.clientIdentity.getAttributeValue('role');
        console.log(role);
        if (role !== 'ROLE_PRODUCER') {
            throw new Error('Solo un Fabricante puede registrar una batería');
        }
        const battery = {
            id,
            manufacturer,
            capacity,
            status: battery_1.BatteryStatus.MANUFACTURED,
            owner: manufacturer,
            health: 100,
            timestamp: new Date().toISOString(),
            recycled: false
        };
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(battery)));
    }
    async transferBattery(ctx, batteryId, newOwner) {
        const batteryBuffer = await ctx.stub.getState(batteryId);
        if (!batteryBuffer || batteryBuffer.length === 0) {
            throw new Error(`Batería ${batteryId} no encontrada`);
        }
        const battery = JSON.parse(batteryBuffer.toString());
        const currentOwner = ctx.clientIdentity.getID(); // Dirección Ethereum del que transfiere
        const currentRole = ctx.clientIdentity.getAttributeValue('role');
        console.log(currentRole);
        if (battery.owner !== currentOwner) {
            throw new Error('No eres el propietario actual de esta batería');
        }
        if (!currentRole) {
            throw new Error('El rol del usuario no está definido');
        }
        if (!(0, accessControl_1.isAuthorized)(currentRole, battery.status, 'in_use')) {
            throw new Error('No tienes permisos para transferir esta batería');
        }
        battery.owner = newOwner;
        await ctx.stub.putState(batteryId, Buffer.from(JSON.stringify(battery)));
    }
    async readBattery(ctx, batteryId) {
        const batteryBuffer = await ctx.stub.getState(batteryId);
        if (!batteryBuffer || batteryBuffer.length === 0) {
            throw new Error(`Batería ${batteryId} no encontrada`);
        }
        return batteryBuffer.toString();
    }
};
exports.BatteryContract = BatteryContract;
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], BatteryContract.prototype, "registerBattery", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String, String]),
    __metadata("design:returntype", Promise)
], BatteryContract.prototype, "transferBattery", null);
__decorate([
    (0, fabric_contract_api_1.Transaction)(false),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [fabric_contract_api_1.Context, String]),
    __metadata("design:returntype", Promise)
], BatteryContract.prototype, "readBattery", null);
exports.BatteryContract = BatteryContract = __decorate([
    (0, fabric_contract_api_1.Info)({ title: 'BatteryContract', description: 'Trazabilidad de Baterías' })
], BatteryContract);
