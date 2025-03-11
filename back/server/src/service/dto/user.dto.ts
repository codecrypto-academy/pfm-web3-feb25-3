import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';
import { IsEthereumAddress } from 'class-validator';
import { ObjectId } from 'mongodb';

/**
 * User DTO optimized for Ethereum authentication.
 */
export class UserDTO  {
  @Transform(({ value }) => (value instanceof ObjectId ? value.toHexString() : value), { toPlainOnly: true })
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
