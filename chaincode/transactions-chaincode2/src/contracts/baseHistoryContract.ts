import { Context, Contract, Transaction } from 'fabric-contract-api';
import { BatteryTransaction } from '../domain/battery';
/**
 * @class BatteryHistoryContract esta se genero con basicts2
 * @extends Contract
 * @description Contracto para la gestión de historial de baterías
 */
export class BatteryHistoryContract extends Contract {
  
  @Transaction()
  public async addHistoryEntry(
      ctx: Context, 
      idBattery: string, 
      action: string, 
      from: string, 
      to: string, 
      batteryDataString: string  // 🔥 Recibimos el JSON de la batería
  ): Promise<void> {
      
      console.log(`📌 Registrando historial para batería ${idBattery}`);
  
      // ✅ Convertimos el string JSON de la batería a un objeto
      const battery = JSON.parse(batteryDataString);
  
      // ✅ Convertimos el historial de string a array
      const history: BatteryTransaction[] = JSON.parse(battery.history || '[]');
  
      // ✅ Obtener ID de la transacción y timestamp de Fabric
      const txId = ctx.stub.getTxID();
      const txTimestamp = ctx.stub.getTxTimestamp();
      const timestampMilliseconds = txTimestamp.seconds?.low ? txTimestamp.seconds.low * 1000 : Date.now();
  
      // ✅ Creamos la nueva transacción del historial
      const transaction: BatteryTransaction = {
          idBattery: idBattery,
          timestamp: new Date().toISOString(),
          action: action,
          from: from,
          to: to,
          transactionId: txId,
          timestampBlockchain: new Date(timestampMilliseconds).toISOString(),
      };
  
      history.push(transaction);
      battery.history = JSON.stringify(history);
  
      // ✅ 🔥 Guardamos la batería con el historial actualizado en `BatteryHistoryContract`
      await ctx.stub.putState(idBattery, Buffer.from(JSON.stringify(battery)));
  
      console.log(`✅ Historial de batería ${idBattery} actualizado`);
  }
  
}
