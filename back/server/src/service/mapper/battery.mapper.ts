import { Battery } from "../../domain/battery.entity";
import { BatteryDTO } from "../dto/battery.dto";
import { ObjectId } from "mongodb";

/**
 * Mapper para convertir entre la entidad Battery y el DTO BatteryDTO.
 */
export class BatteryMapper {

    // Método para convertir una lista de entidades a una lista de DTOs
    static fromEntityListToDTOList(batteries: Battery[]): BatteryDTO[] {
      return batteries.map(battery => this.fromEntityToDTO(battery));
    }
  
    // Método para convertir una lista de DTOs a una lista de entidades
    static fromDTOListToEntityList(batteryDTOs: BatteryDTO[]): Battery[] {
      return batteryDTOs.map(batteryDTO => this.fromDTOtoEntity(batteryDTO));
    }


  static fromEntityToDTO(battery: Battery): BatteryDTO {
    const batteryDTO = new BatteryDTO();
    
    // Convertimos ObjectId a string
    batteryDTO.id = battery._id ? battery._id.toHexString() : undefined;  // Convertir ObjectId a string si existe
    batteryDTO.serialNumber = battery.serialNumber;
    batteryDTO.capacity = battery.capacity;
    batteryDTO.status = battery.status;
    batteryDTO.manufacturerId = battery.manufacturerId; // Mapeamos manufacturerId como manufacturer
    batteryDTO.currentOwnerId = battery.currentOwnerId; // Mapeamos currentOwnerId como currentOwner
    batteryDTO.location = battery.location;
    
    return batteryDTO;
  }

  static fromDTOtoEntity(batteryDTO: BatteryDTO): Battery {
    const battery = new Battery();
    
    // Si el DTO tiene un ID, lo convertimos a ObjectId en la entidad (en el caso de actualizaciones)
    if (batteryDTO.id) {
      battery._id = new ObjectId(batteryDTO.id);
    }

    battery.serialNumber = batteryDTO.serialNumber;
    battery.capacity = batteryDTO.capacity;
    battery.status = batteryDTO.status;
    battery.manufacturerId = batteryDTO.manufacturerId; 
    battery.currentOwnerId = batteryDTO.currentOwnerId;
    battery.location = batteryDTO.location;

    return battery;
  }
}
