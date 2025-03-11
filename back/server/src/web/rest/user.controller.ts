import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, RoleType, Roles, RolesGuard } from '../../security';
import { UserDTO } from '../../service/dto/user.dto';
import { HeaderUtil } from '../../client/header-util';
import { Request } from '../../client/request';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { UserService } from '../../service/user.service';

@Controller('api/admin/users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('user-resource')
export class UserController {
  logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Get('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get the list of users' })
  @ApiResponse({
    status: 200,
    description: 'List all users',
    type: UserDTO,
  })
  async getAllUsers(@Req() req: Request): Promise<UserDTO[]> {
    // Eliminamos la paginación, ahora simplemente devolvemos todos los usuarios
    const results = await this.userService.findAll();  
    return results;
  }

  @Post('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: UserDTO,
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createUser(@Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO> {
    // En el caso de MetaMask, no necesitamos asignar un password
    // userDTO.password = userDTO.login; // Esto ya no es necesario

    // Se asignan roles al usuario
    userDTO.roles = ['ROLE_USER']; // Definir rol por defecto si es necesario

    const created = await this.userService.save(userDTO);  // Guardamos el usuario
    HeaderUtil.addEntityCreatedHeaders(req.res, 'User', created.id);  // Añadimos encabezados de creación
    return created;  // Retornamos el usuario creado
  }

  @Put('/')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: UserDTO,
  })
  async updateUser(@Req() req: Request, @Body() userDTO: UserDTO): Promise<UserDTO> {
    // Buscamos al usuario por su dirección Ethereum (ethereumAddress)
    const userOnDb = await this.userService.find({ where: { ethereumAddress: userDTO.ethereumAddress } });
    let updated = false;
    if (userOnDb && userOnDb.id) {
      userDTO.id = userOnDb.id;
      updated = true;
    } else {
      // Si el usuario no existe, le asignamos un rol por defecto
      userDTO.roles = ['ROLE_USER']; // Aseguramos que se le asigna un rol
    }
    const createdOrUpdated = await this.userService.save(userDTO);  // Guardamos o actualizamos el usuario

    if (updated) {
      HeaderUtil.addEntityUpdatedHeaders(req.res, 'User', createdOrUpdated.id);  // Añadimos encabezados de actualización
    } else {
      HeaderUtil.addEntityCreatedHeaders(req.res, 'User', createdOrUpdated.id);  // Si el usuario es nuevo, añadimos encabezados de creación
    }
    return createdOrUpdated;  // Retornamos el usuario creado o actualizado
  }

  @Get('/:ethereumAddress')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Get user' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: UserDTO,
  })
  async getUser(@Param('ethereumAddress') ethereumAddress: string): Promise<UserDTO> {
    return await this.userService.find({ where: { ethereumAddress } });  // Buscamos por dirección Ethereum (ethereumAddress)
  }

  @Delete('/:ethereumAddress')
  @Roles(RoleType.ADMIN)
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.',
    type: UserDTO,
  })
  async deleteUser(@Req() req: Request, @Param('ethereumAddress') ethereumAddress: string): Promise<UserDTO> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'User', ethereumAddress);  // Añadimos encabezados de eliminación
    const userToDelete = await this.userService.find({ where: { ethereumAddress } });  // Buscamos el usuario por su dirección Ethereum (ethereumAddress)
    return await this.userService.delete(userToDelete);  // Eliminamos el usuario
  }
}
