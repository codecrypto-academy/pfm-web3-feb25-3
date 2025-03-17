import { Injectable, Logger } from '@nestjs/common';
import { FabricClient } from '../client/FabricClient';

@Injectable()
export class ContractService {
  private readonly logger = new Logger('ContractService');

  constructor(private readonly fabricClient: FabricClient) {}

  async transferBattery(batteryId: string, newOwner: string): Promise<void> {
    try {
      this.logger.log(`Iniciando transferencia de batería ${batteryId} a ${newOwner}`);

      await this.fabricClient.init(); // Inicializa la conexión con Fabric

      await this.fabricClient.submitTransaction('transferBattery', batteryId, newOwner);

      this.logger.log(`Batería ${batteryId} transferida con éxito a ${newOwner}`);
    } catch (error) {
      this.logger.error('Error en la transferencia de batería:', error);
      throw error;
    } finally {
      this.fabricClient.close(); // Cierra la conexión después de la transacción
    }
  }


  async registerBattery(id: string): Promise<string> {
    try {
      this.logger.log(`Iniciando registro de batería ${id}`);
      
      await this.fabricClient.init(); // Inicializa la conexión con Fabric

      await this.fabricClient.submitTransaction('registerBattery', id , "300");

      this.logger.log(`Batería ${id} registrada correctamente`);
      return `Batería ${id} registrada correctamente`;
    } catch (error) {
      this.logger.error('Error en el registro de batería:', error);
      throw error;
    } finally {
      this.fabricClient.close(); // Cierra la conexión después de la transacción
    }
  }

}
