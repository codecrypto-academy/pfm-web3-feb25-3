import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsArray, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * User DTO object optimized for Ethereum authentication.
 */
export class UserDTO  {
  @Transform(({ value }) => (value?.toHexString ? value?.toHexString() : value), { toPlainOnly: true })
  id?: string;

  @ApiProperty({ uniqueItems: true, example: '0x1234567890abcdef1234567890abcdef12345678', description: 'Ethereum Address' })
  @IsEthereumAddress()
  ethereumAddress: string;

  @ApiProperty({
    isArray: true,
    enum: ['ROLE_USER', 'ROLE_ADMIN'],
    description: 'User roles',
  })
  @IsArray()
  @IsString({ each: true })
  roles: string[];
}
