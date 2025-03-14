import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { BatteryStatus } from '../../domain/enum/battery-status.enum';  // Asegúrate de importar el enum correctamente

/**
 * Battery DTO for API exposure.
 */
export class BatteryDTO {
  
  @ApiProperty({ example: '60e4f99f3b8a7c1a56f0e687', description: 'Unique battery identifier (ID)' })
  @IsString()
  @IsOptional()  // El id es opcional, no lo requiere para la creación
  id?: string;  // ID de la batería (corresponde al _id de la entidad)

  @ApiProperty({ example: '1234567890', description: 'Unique battery serial number' })
  @IsString()
  serialNumber: string;  // Número de serie único de la batería

  @ApiProperty({ example: 100, description: 'The battery capacity in kWh' })
  @IsNumber()
  capacity: number;  // Capacidad de la batería en kWh

  @ApiProperty({
    enum: BatteryStatus,
    example: BatteryStatus.MANUFACTURED,
    description: 'Current status of the battery (e.g., Manufactured, In Transit, Installed, Recycled)',
  })
  @IsEnum(BatteryStatus)
  status: BatteryStatus;  // Estado de la batería

  @ApiProperty({ example: 'Manufacturer A', description: 'Name of the manufacturer' })
  @IsString()
  manufacturer: string;  // Nombre del fabricante (lo mapeamos como manufacturer en el DTO)

  @ApiProperty({ example: 'New York', description: 'Location of the battery (optional)' })
  @IsString()
  @IsOptional()
  location?: string;  // Ubicación actual de la batería (opcional)
}
