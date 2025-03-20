import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';
import { Battery, BatteryStatus } from '../domain/battery';

// Función de control de acceso (se puede ajustar según el sistema)
function isAuthorized(role: string, status: BatteryStatus, action: string): boolean {
	// Este es un ejemplo básico. Los roles y acciones deberían ser definidos más específicamente
	if (role === 'ROLE_PRODUCER' && action === 'register') {
		return true; // El productor puede registrar baterías
	}
	if (role === 'ROLE_DISTRIBUTOR' && status === BatteryStatus.RECEIVED && action === 'transfer') {
		return true; // El distribuidor puede transferir baterías cuando están en "Recibidas"
	}
	return false; // De lo contrario, no autorizado
}


// Se genero con basicts
@Info({ title: 'BatteryContract', description: 'Gestión de baterías' })
export class BatteryContract extends Contract {

	@Transaction()
public async registerBattery(ctx: Context, id: string, serialNumber: string, capacity: string): Promise<void> {
	const manufacturerId = ctx.clientIdentity.getID();

	console.log(`🚀 Registrando batería con ID: ${id} para el fabricante: ${manufacturerId}`);

	const battery = new Battery();
	battery.id = id;
	battery.serialNumber = serialNumber;
	battery.capacity = capacity;
	battery.manufacturerId = manufacturerId;
	battery.currentOwnerId = manufacturerId;
	battery.status = BatteryStatus.MANUFACTURED;
	battery.history = JSON.stringify([]);

	// 🔥 Guardamos la batería en el ledger de `BatteryContract`
	await ctx.stub.putState(id, Buffer.from(JSON.stringify(battery)));

	console.log(`✅ Batería ${id} registrada exitosamente`);

	// ✅ Pasamos la información de la batería al `BatteryHistoryContract`
	//
    // await ctx.stub.invokeChaincode(
	// 	'basicts2', // Nombre del chaincode de historial
	// 	[
	// 		'addHistoryEntry', 
	// 		id, 
	// 		'CREATED', 
	// 		manufacturerId, 
	// 		manufacturerId, 
	// 		JSON.stringify(battery) // 🔥 Pasamos la batería completa
	// 	], 
	// 	'mychannel'
	// );
}

	@Transaction()
	public async transferBattery(ctx: Context, id: string, newOwnerId: string): Promise<void> {
		const batteryData = await ctx.stub.getState(id);
		if (!batteryData || batteryData.length === 0) {
			throw new Error(`Battery ${id} not found`);
		}

		const battery = JSON.parse(batteryData.toString());

		// Guardamos el historial antes de actualizar el propietario
		const oldOwnerId = battery.currentOwnerId;
		battery.currentOwnerId = newOwnerId;

		await ctx.stub.putState(id, Buffer.from(JSON.stringify(battery)));

		// 🔥 Llamamos a `addHistoryEntry` del mismo contrato, usando `ctx.stub.invokeChaincode`
		// await ctx.stub.invokeChaincode('batteryHistory', ['addHistoryEntry', id, 'TRANSFERRED', oldOwnerId, newOwnerId], 'mychannel');
	}

	@Transaction(false)
	@Returns('string')
	public async getBattery(ctx: Context, id: string): Promise<string> {
		const batteryData = await ctx.stub.getState(id);
		if (!batteryData || batteryData.length === 0) {
			throw new Error(`Battery ${id} not found`);
		}
		return batteryData.toString();
	}

	/**
		* ✅ 🔥 Nueva función para obtener todas las baterías en la red
		*/
	@Transaction(false)
	@Returns('string')
	public async getAllBatteries(ctx: Context): Promise<string> {
		const iterator = await ctx.stub.getStateByRange('', '');
		const batteries = [];

		let result = await iterator.next();
		while (!result.done) {
			const battery = JSON.parse(result.value.value.toString());
			batteries.push(battery);
			result = await iterator.next();
		}

		return JSON.stringify(batteries);
	}
}
