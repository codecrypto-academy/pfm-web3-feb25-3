import { UserDTO } from './user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDTO extends UserDTO {

  @ApiProperty({ example: '0xSignature...', description: 'Signature' })
  signature: string;

  @ApiProperty({ example: '123456', description: 'Nonce' })
  nonce: string;
}
