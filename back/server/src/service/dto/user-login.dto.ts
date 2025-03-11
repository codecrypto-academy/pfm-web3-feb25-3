import { ApiProperty } from '@nestjs/swagger';
import { IsEthereumAddress, IsString } from 'class-validator';

/**
 * DTO para el login con MetaMask.
 */
export class UserLoginDTO {
  @ApiProperty({ example: '0x1234567890abcdef1234567890abcdef12345678', description: 'Ethereum address for login' })
  @IsEthereumAddress()
  ethereumAddress: string;

  @ApiProperty({ example: '0xabcdef...', description: 'Signature of the message signed by the user' })
  @IsString()
  signature: string;

  @ApiProperty({ example: '123456', description: 'Nonce used for signing' })
  @IsString()
  nonce: string;
}
