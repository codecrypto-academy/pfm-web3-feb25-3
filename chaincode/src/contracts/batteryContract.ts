import { Context, Contract, Info, Transaction } from 'fabric-contract-api';
import { Battery, BatteryStatus } from '../domain/battery';
import { isAuthorized } from '../accessControl';

@Info({ title: 'BatteryContract', description: 'Trazabilidad de Baterías' })
export class BatteryContract extends Contract {

  @Transaction()
  public async registerBattery(ctx: Context, id: string, capacity: string): Promise<void> {
    const manufacturer = ctx.clientIdentity.getID(); // Ethereum Address del fabricante
    const role = ctx.clientIdentity.getAttributeValue('role');
    console.log(role);
    if (role !== 'ROLE_PRODUCER') {
      throw new Error('Solo un Fabricante puede registrar una batería');
    }

    const battery: Battery = {
      id,
      manufacturer,
      capacity,
      status: BatteryStatus.MANUFACTURED,
      owner: manufacturer,
      health: 100,
      timestamp: new Date().toISOString(),
      recycled: false
    };

    await ctx.stub.putState(id, Buffer.from(JSON.stringify(battery)));
  }

  @Transaction()
  public async transferBattery(ctx: Context, batteryId: string, newOwner: string): Promise<void> {
    const batteryBuffer = await ctx.stub.getState(batteryId);
    if (!batteryBuffer || batteryBuffer.length === 0) {
      throw new Error(`Batería ${batteryId} no encontrada`);
    }

    const battery: Battery = JSON.parse(batteryBuffer.toString());
    const currentOwner = ctx.clientIdentity.getID(); // Dirección Ethereum del que transfiere
    const currentRole = ctx.clientIdentity.getAttributeValue('role');
    console.log(currentRole);
    if (battery.owner !== currentOwner) {
      throw new Error('No eres el propietario actual de esta batería');
    }

    if (!currentRole) {
      throw new Error('El rol del usuario no está definido');
    }

    if (!isAuthorized(currentRole, battery.status, 'in_use')) {
      throw new Error('No tienes permisos para transferir esta batería');
    }

    battery.owner = newOwner;
    await ctx.stub.putState(batteryId, Buffer.from(JSON.stringify(battery)));
  }

  @Transaction(false)
  public async readBattery(ctx: Context, batteryId: string): Promise<string> {
    const batteryBuffer = await ctx.stub.getState(batteryId);
    if (!batteryBuffer || batteryBuffer.length === 0) {
      throw new Error(`Batería ${batteryId} no encontrada`);
    }

    return batteryBuffer.toString();
  }
}
