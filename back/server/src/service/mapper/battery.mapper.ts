import { Battery } from "src/domain/battery.entity";
import { BatteryDTO } from "../dto/battery.dto";
import { ObjectId } from "mongodb";

/**
 * Mapper para convertir entre la entidad Battery y el DTO BatteryDTO.
 */
export class BatteryMapper {
  static fromEntityToDTO(battery: Battery): BatteryDTO {
    const batteryDTO = new BatteryDTO();
    
    // Convertimos ObjectId a string
    batteryDTO.id = battery._id ? battery._id.toHexString() : undefined;  // Convertir ObjectId a string si existe
    batteryDTO.serialNumber = battery.serialNumber;
    batteryDTO.capacity = battery.capacity;
    batteryDTO.status = battery.status;
    batteryDTO.manufacturer = battery.manufacturerId; // Mapeamos manufacturerId como manufacturer
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
    
    // Mapeamos manufacturer a manufacturerId
    battery.manufacturerId = batteryDTO.manufacturer; 

    battery.location = batteryDTO.location;

    return battery;
  }
}
