import { IsEthereumAddress } from 'class-validator';
import { Injectable, Logger } from '@nestjs/common';
import { FabricChaincodeClient } from '../client/fabric-chaincode-client';
import { UserDTO } from 'src/service/dto/user.dto';
import { UserService } from './user.service';

@Injectable()
export class ContractService {

  private readonly logger = new Logger('ContractService');

  constructor(private readonly fabricClient: FabricChaincodeClient,
    private readonly userService: UserService,
  ) {}

  // Método para invocar el contrato ping
  async pingContract(ethereumAddress: string): Promise<string> {

    // Encontramos al usuario por la dirección Ethereum
		const userFind: UserDTO = await this.userService.findByFields({ where: { ethereumAddress } });
    this.logger.log('Inicializando conexión con el contrato Ping');

    // Inicializamos la conexión con el contrato usando la identidad del usuario
    await this.fabricClient.init(userFind);

    try {
      // Invocamos la transacción 'ping' del contrato
      const result = await this.fabricClient.evaluateTransaction('ping');

      // Cerrar la conexión después de la transacción
      await this.fabricClient.close();
      
      // Si la transacción fue exitosa, podemos devolver un mensaje
      return result;
    } catch (error) {
      this.logger.error('Error al invocar el contrato Ping: ', error);
      throw new Error('Error al invocar el contrato Ping');
    }
  }
}
