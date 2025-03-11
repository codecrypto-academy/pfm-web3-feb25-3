/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { PasswordChangeDTO } from '../../service/dto/password-change.dto';
import { UserDTO } from '../../service/dto/user.dto';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { AuthService } from '../../service/auth.service';
import { compareSignature } from '../../../utils/signature-utils';

@Controller('api')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiTags('account-resource')
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Register user via MetaMask' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: UserDTO,
  })
  async registerAccount(@Req() req: Request, @Body() userDTO: UserDTO & { signature: string; nonce: string }): Promise<any> {
    const { ethereumAddress, signature, nonce } = userDTO;

    if (!ethereumAddress || !signature || !nonce) {
      throw new BadRequestException('Ethereum address, signature, and nonce are required');
    }

    // Validar firma
    const isValidSignature = await compareSignature(nonce, signature, ethereumAddress);
    if (!isValidSignature) {
      throw new BadRequestException('Invalid signature');
    }

    // Registrar o autenticar usuario
    try {
      const user = await this.authService.registerNewUser(userDTO);
      return { message: 'User registered successfully', user };
    } catch (error) {
      if (error.code === 11000) {
        // Error de clave única en MongoDB
        throw new ConflictException('User already exists');
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('/authenticate')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Check if the user is authenticated' })
  @ApiResponse({
    status: 200,
    description: 'login authenticated',
  })
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user.login;
  }

  @Get('/account')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get the current user.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved',
  })
  async getAccount(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    const userProfileFound = await this.authService.getAccount(user.id);
    if (!userProfileFound) {
      return null;
    }

    return userProfileFound;
  }
}
