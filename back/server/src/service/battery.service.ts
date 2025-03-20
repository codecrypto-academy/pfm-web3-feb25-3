import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Battery } from '../domain/battery.entity'; // Importa la entidad Battery
import { BatteryDTO } from './dto/battery.dto'; // Importa el BatteryDTO
import { BatteryMapper } from './mapper/battery.mapper'; // Mapeo entre entidad y DTO
import { FabricChaincodeClient } from '../client/fabric-chaincode-client'; // Cliente para interactuar con Hyperledger Fabric
import { UserDTO } from './dto/user.dto'; // Información del usuario
import { ObjectId } from 'mongodb';
import { BatteryStatus } from '../domain/enum/battery-status.enum';

@Injectable()
export class BatteryService {
  private readonly logger = new Logger(BatteryService.name);

  constructor(
    @InjectRepository(Battery) private batteryRepository: Repository<Battery>, // Repositorio de la base de datos
    private readonly fabricClient: FabricChaincodeClient, // Cliente de Hyperledger Fabric
  ) {}

  /**
   * Obtener todas las baterías. Usa la base de datos o la blockchain según lo necesites.
   * @param user Información del usuario autenticado.
   */
  async getAllBatteries(user: UserDTO): Promise<BatteryDTO[]> {
    try {
      this.logger.log(`User ${user.ethereumAddress} is fetching all batteries`);

      const batteriesFromChaincode = BatteryMapper.fromEntityListToDTOList(await this.batteryRepository.find());
      return batteriesFromChaincode 
    } catch (error) {
      this.logger.error('Error al obtener todas las baterías desde la blockchain o base de datos:', error);
      throw new Error('Error al obtener todas las baterías');
    }
  }

  /**
   * Registrar una nueva batería tanto en la base de datos como en la blockchain.
   * @param user Información del usuario autenticado.
   * @param id ID único de la batería
   * @param serialNumber Número de serie de la batería
   * @param capacity Capacidad de la batería
   */
  async registerBattery(user: UserDTO, batteryDTO: BatteryDTO): Promise<BatteryDTO> {
    try {
      this.logger.log(`User ${user.ethereumAddress} is registering a new battery`);
      
      batteryDTO.manufacturerId = user.ethereumAddress;
      batteryDTO.currentOwnerId = null;
      const savedBattery = await this.batteryRepository.save(batteryDTO);

      
      // Llamar al chaincode para registrar la batería en la blockchain
      await this.fabricClient.submitTransaction(
        user, // El usuario que está registrando la batería
        'BatteryContract', // Nombre del contrato
        'registerBattery', // Nombre de la transacción
        savedBattery._id.toString(), savedBattery.serialNumber, savedBattery.capacity.toString()// Pasamos los parámetros correctamente como strings
      );
  
      // Convertir la entidad guardada a DTO
      return BatteryMapper.fromEntityToDTO(savedBattery);
    } catch (error) {
      this.logger.error('Error al registrar la batería:', error);
      throw new Error('Error al registrar la batería');
    }
  }
  

  /**
   * Actualizar el estado de una batería tanto en la base de datos como en la blockchain.
   * @param batteryDTO Datos de la batería a actualizar
   * @param user Información del usuario autenticado.
   */
  async updateBattery(batteryDTO: BatteryDTO, user: UserDTO): Promise<BatteryDTO> {
    try {
      this.logger.log(`User ${user.ethereumAddress} is updating battery ${batteryDTO.id}`);

      // Llamar al chaincode para actualizar el estado de la batería en la blockchain
       await this.fabricClient.evaluateTransaction(
        user, // El usuario que realiza la actualización
        'BatteryContract', // Nombre del contrato
        'updateBattery', // Nombre de la transacción
        batteryDTO.id, batteryDTO.status // Pasamos los parámetros necesarios (id de la batería y nuevo estado)
      );

      // También actualizar en la base de datos local
      const batteryEntity = await this.batteryRepository.findOne({ where: { _id: new ObjectId(batteryDTO.id) } });
      if (batteryEntity) {
        batteryEntity.status = batteryDTO.status; // Actualizamos el estado
        await this.batteryRepository.save(batteryEntity); // Guardamos en la base de datos
      }

      // Convertir el resultado a DTO
      return BatteryMapper.fromEntityToDTO(batteryEntity);
    } catch (error) {
      this.logger.error('Error al actualizar la batería:', error);
      throw new Error('Error al actualizar la batería');
    }
  }

  /**
   * Obtener una batería por su número de serie desde la base de datos.
   * @param serialNumber Número de serie de la batería
   */
  async getBattery(serialNumber: string): Promise<BatteryDTO> {
    try {
      this.logger.log(`Fetching battery by serial number: ${serialNumber}`);

      // Buscar la batería en la base de datos local
      const batteryEntity = await this.batteryRepository.findOne({ where: { serialNumber } });
      if (!batteryEntity) {
        throw new Error(`Batería con número de serie ${serialNumber} no encontrada en la base de datos`);
      }

      // Convertir la entidad a DTO
      return BatteryMapper.fromEntityToDTO(batteryEntity);
    } catch (error) {
      this.logger.error('Error al obtener la batería:', error);
      throw new Error('Error al obtener la batería');
    }
  }
  
  async getProducerBatteries(user: UserDTO): Promise<BatteryDTO[]> {
    this.logger.log(`Fetching batteries for producer ${user.ethereumAddress}`);
    const batteries = await this.batteryRepository.find({
      where: { manufacturerId: user.ethereumAddress },
    });
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }

  async getDistributorBatteries(user: UserDTO): Promise<BatteryDTO[]> {
    this.logger.log(`Fetching batteries for distributor ${user.ethereumAddress}`);
    const batteries = await this.batteryRepository.find({
      where: { currentOwnerId: user.ethereumAddress, status: BatteryStatus.IN_TRANSIT },
    });
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }

  async getOwnerBatteries(user: UserDTO): Promise<BatteryDTO[]> {
    this.logger.log(`Fetching batteries for owner ${user.ethereumAddress}`);
    const batteries = await this.batteryRepository.find({
      where: { currentOwnerId: user.ethereumAddress },
    });
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }

  async getAvailableBatteriesForOwner(): Promise<BatteryDTO[]> {
    this.logger.log(`Fetching available batteries for owners`);
    const batteries = await this.batteryRepository.find({
      where: { currentOwnerId: null, status: BatteryStatus.IN_TRANSIT },
    });
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }

  async getAvailableBatteriesForDistributor(): Promise<BatteryDTO[]> {
    this.logger.log(`Fetching available batteries for distributors`);
    const batteries = await this.batteryRepository.find({
      where: { currentOwnerId: null, status: BatteryStatus.MANUFACTURED },
    });
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }
}
