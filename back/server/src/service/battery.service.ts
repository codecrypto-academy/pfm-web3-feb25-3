import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
import { Battery } from '../domain/battery.entity';  // Asegúrate de importar la entidad Battery
import { BatteryDTO } from './dto/battery.dto'; // Asegúrate de importar el BatteryDTO
import { BatteryMapper } from './mapper/battery.mapper';
import { ObjectId } from 'mongodb';

@Injectable()
export class BatteryService {
  private readonly logger = new Logger(BatteryService.name);

  constructor(@InjectRepository(Battery) private batteryRepository: Repository<Battery>) {}

  // Buscar una batería por ID
  async findById(id: string): Promise<BatteryDTO | undefined> {
    try {
      this.logger.debug(`🔍 Buscando batería con ID: ${id}`);

      const result = await this.batteryRepository.findOneBy({ _id: new ObjectId(id) });

      if (!result) {
        this.logger.warn(`⚠️ Batería con ID ${id} no encontrada.`);
        return undefined;
      }

      this.logger.log(`✅ Batería con ID ${id} encontrada.`);
      return BatteryMapper.fromEntityToDTO(result);
    } catch (error) {
      this.logger.error(`❌ Error en findById(${id}):`, error);
      throw new Error("No se pudo obtener la batería. Inténtalo de nuevo más tarde.");
    }
  }

  // Buscar una batería con opciones específicas
  async find(options: FindOneOptions<Battery>): Promise<BatteryDTO | undefined> {
    this.logger.debug(`🔍 Buscando batería con opciones: ${JSON.stringify(options)}`);
    const result = await this.batteryRepository.findOne(options);
    if (!result) {
      this.logger.warn(`⚠️ Batería no encontrada con opciones: ${JSON.stringify(options)}`);
      return undefined;
    }
    this.logger.log(`✅ Batería encontrada con opciones: ${JSON.stringify(options)}`);
    return BatteryMapper.fromEntityToDTO(result);
  }

  // Buscar todas las baterías
  async findAll(): Promise<BatteryDTO[]> {
    this.logger.debug("🔍 Obteniendo todas las baterías...");

    const batteries = await this.batteryRepository.find();
    if (batteries.length === 0) {
      this.logger.warn("⚠️ No se encontraron baterías en la base de datos.");
      return [];
    }

    this.logger.log(`✅ Se encontraron ${batteries.length} baterías.`);
    return batteries.map(battery => BatteryMapper.fromEntityToDTO(battery));
  }

  // Guardar una batería (crear o actualizar)
  async save(batteryDTO: BatteryDTO): Promise<BatteryDTO | undefined> {
    this.logger.debug(`💾 Guardando batería: ${JSON.stringify(batteryDTO)}`);

    const battery = BatteryMapper.fromDTOtoEntity(batteryDTO);
    const result = await this.batteryRepository.save(battery);

    this.logger.log(`✅ Batería guardada con éxito. ID: ${result._id}`);
    return BatteryMapper.fromEntityToDTO(result);
  }

  // Actualizar una batería
  async update(batteryDTO: BatteryDTO): Promise<BatteryDTO | undefined> {
    this.logger.debug(`🔄 Actualizando batería: ${JSON.stringify(batteryDTO)}`);
    return this.save(batteryDTO);  // Reutilizamos el método save para crear o actualizar
  }

  // Eliminar una batería
  async delete(batteryDTO: BatteryDTO): Promise<BatteryDTO | undefined> {
    this.logger.debug(`🗑️ Eliminando batería con serialNumber: ${batteryDTO.serialNumber}`);

    const battery = BatteryMapper.fromDTOtoEntity(batteryDTO);
    const result = await this.batteryRepository.remove(battery);

    this.logger.log(`✅ Batería con serialNumber ${batteryDTO.serialNumber} eliminada correctamente.`);
    return BatteryMapper.fromEntityToDTO(result);
  }
}
