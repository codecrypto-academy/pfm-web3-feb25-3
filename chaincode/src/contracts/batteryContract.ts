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

@Info({ title: 'BatteryContract', description: 'Trazabilidad de Baterías' })
export class BatteryContract extends Contract {

	/**
		* Obtener todas las baterías.
		*/

    @Transaction(false)
    @Returns('string')
    public async getAllBatteries(ctx: Context): Promise<string> {
      const allResults = [];
    
      // Realiza una consulta de rango sobre el ledger (obteniendo todas las baterías)
      const iterator = await ctx.stub.getStateByRange('', '');
      let result = await iterator.next();
    
      // Recorre todas las baterías obtenidas del ledger
      while (!result.done) {
        const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
        let record;
        try {
          // Parsear el valor almacenado en el ledger (batería)
          record = JSON.parse(strValue) as Battery;
        } catch (err) {
          // Si ocurre un error al parsear el JSON, logear el error
          console.log('Error al parsear la batería', err);
          record = strValue;  // Si no se puede parsear, se mantiene el valor original
        }
        // Agregar el resultado a la lista
        allResults.push(record);
        result = await iterator.next();  // Continuar con el siguiente elemento
      }
    
      // Cerrar el iterador después de obtener todos los resultados
      iterator.close();
    
      // Retornar todas las baterías como un JSON
      return JSON.stringify(allResults);
    }

	// Los otros métodos como registerBattery, transferBattery, etc.

	/**
		* Registrar una nueva batería.
		* Solo un fabricante puede registrar baterías.
		*/
	@Transaction()
	public async registerBattery(ctx: Context, id: string, serialNumber: string, capacity: string): Promise<void> {
		const manufacturer = ctx.clientIdentity.getID(); // Obtener el ID del fabricante
		const role = ctx.clientIdentity.getAttributeValue('role'); // Obtener el rol del cliente
		console.log(role);

		if (role !== 'ROLE_PRODUCER') {
			throw new Error('Solo un Fabricante puede registrar una batería');
		}

		// Crear el objeto de batería con estado "Manufactured"
		const battery: Battery = {
			id,
			serialNumber,
			capacity,
			manufacturerId: manufacturer,
			currentOwnerId: manufacturer,
			status: BatteryStatus.MANUFACTURED,
			location: '', // De momento, no hay ubicación
		};

		// Guardar la batería en el ledger de Hyperledger Fabric
		await ctx.stub.putState(id, Buffer.from(JSON.stringify(battery)));
	}

	/**
		* Transferir la propiedad de una batería.
		* Solo el propietario actual puede transferir la batería.
		*/
	@Transaction()
	public async transferBattery(ctx: Context, batteryId: string, newOwner: string): Promise<void> {
		
    const batteryString = await this.readBattery(ctx, batteryId);
    const battery = JSON.parse(batteryString) as Battery;

		// Obtener el rol y la identidad del propietario actual
		const currentOwner = ctx.clientIdentity.getID();
		const currentRole = ctx.clientIdentity.getAttributeValue('role');
		console.log(currentRole);

		// Verificar que el actual propietario sea el que está intentando hacer la transferencia
		if (battery.currentOwnerId !== currentOwner) {
			throw new Error('No eres el propietario actual de esta batería');
		}

		if (!currentRole) {
			throw new Error('El rol del usuario no está definido');
		}

		// Verificar si el usuario tiene permisos para transferir la batería
		if (!isAuthorized(currentRole, battery.status as BatteryStatus, 'transfer')) {
			throw new Error('No tienes permisos para transferir esta batería');
		}

		// Actualizar el propietario de la batería
		battery.currentOwnerId = newOwner;
		battery.status = BatteryStatus.SOLD; // Cambiar el estado a "Sold" después de la transferencia

		// Guardar la batería actualizada en el ledger
		await ctx.stub.putState(batteryId, Buffer.from(JSON.stringify(battery)));
	}

	/**
		* Consultar los detalles de una batería.
		* Se puede consultar sin restricciones.
		*/
	@Transaction(false)
	public async readBattery(ctx: Context, batteryId: string): Promise<string> {
		// Obtener la batería desde el ledger
		const batteryBuffer = await ctx.stub.getState(batteryId);
		if (!batteryBuffer || batteryBuffer.length === 0) {
			throw new Error(`Batería ${batteryId} no encontrada`);
		}

		// Retornar los detalles de la batería como un string JSON
		return batteryBuffer.toString();
	}
}
