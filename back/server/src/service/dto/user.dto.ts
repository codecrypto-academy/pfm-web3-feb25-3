import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';
import { IsEthereumAddress } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserType } from '../../domain/enum/user-type.enum';

/**
 * DTO para la entidad User, usado en la comunicación con la API.
 */
export class UserDTO {
  @Transform(({ value }) => (value instanceof ObjectId ? value.toHexString() : value), { toPlainOnly: true })
  id?: string;

  @ApiProperty({ uniqueItems: true, example: '0x1234567890abcdef1234567890abcdef12345678', description: 'Ethereum Address' })
  @IsEthereumAddress()
  ethereumAddress: string;

  @ApiProperty({
    isArray: true,
    enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_PRODUCER', 'ROLE_MANUFACTURER', 'ROLE_DISTRIBUTOR', 'ROLE_OWNER', 'ROLE_RECYCLER'],
    description: 'User roles',
  })
  @IsArray()
  @IsString({ each: true }) // ✅ Ahora es un array de strings en lugar de Authority[]
  roles: string[];

  @ApiProperty({ enum: UserType, description: 'Tipo de usuario en la plataforma', example: UserType.PRODUCER })
  type?: UserType;

  @ApiProperty({ description: 'Nombre del usuario', example: 'John', required: false })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ description: 'Apellido del usuario', example: 'Doe', required: false })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ description: 'Nombre de la empresa si aplica', example: 'Tesla Inc.', required: false })
  @IsOptional()
  @IsString()
  companyName?: string;
}
