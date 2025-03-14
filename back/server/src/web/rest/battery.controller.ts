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
  import { HeaderUtil } from '../../client/header-util';
  import { Request } from '../../client/request';
  import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
  import { BatteryDTO } from '../../service/dto/battery.dto'; // Asegúrate de importar el DTO
import { BatteryService } from '../../service/battery.service';
  
  @Controller('api/batteries')
  @UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
  @ApiBearerAuth()
  @ApiTags('battery-resource')
  export class BatteryController {
    logger = new Logger('BatteryController');
  
    constructor(private readonly batteryService: BatteryService) {}
  
    // Obtener todas las baterías
    @Get()
    @ApiOperation({ summary: 'Get the list of all batteries' })
    @ApiResponse({
      status: 200,
      description: 'List all batteries',
      type: [BatteryDTO],
    })
    async getAllBatteries(@Req() req: Request): Promise<BatteryDTO[]> {
      const results = await this.batteryService.findAll();
      return results;
    }
  
    // Crear una nueva batería
    @Post('/')
    @Roles(RoleType.PRODUCER)
    @ApiOperation({ summary: 'Create a new battery' })
    @ApiResponse({
      status: 201,
      description: 'The battery has been successfully created.',
      type: BatteryDTO,
    })
    async createBattery(@Req() req: Request, @Body() batteryDTO: BatteryDTO): Promise<BatteryDTO> {
      const created = await this.batteryService.save(batteryDTO);
      HeaderUtil.addEntityCreatedHeaders(req.res, 'Battery', created.id);
      return created;
    }
  
    // Actualizar una batería
    @Put('/')
    @Roles(RoleType.ADMIN, RoleType.PRODUCER, RoleType.MANUFACTURER)
    @ApiOperation({ summary: 'Update a battery' })
    @ApiResponse({
      status: 200,
      description: 'The battery has been successfully updated.',
      type: BatteryDTO,
    })
    async updateBattery(@Req() req: Request, @Body() batteryDTO: BatteryDTO): Promise<BatteryDTO> {
      const batteryOnDb = await this.batteryService.find({ where: { serialNumber: batteryDTO.serialNumber } });
      let updated = false;
      if (batteryOnDb && batteryOnDb.id) {
        batteryDTO.id = batteryOnDb.id;
        updated = true;
      }
      const createdOrUpdated = await this.batteryService.save(batteryDTO);
  
      if (updated) {
        HeaderUtil.addEntityUpdatedHeaders(req.res, 'Battery', createdOrUpdated.id);
      } else {
        HeaderUtil.addEntityCreatedHeaders(req.res, 'Battery', createdOrUpdated.id);
      }
      return createdOrUpdated;
    }
  
    // Obtener una batería por número de serie
    @Get('/:serialNumber')
    @Roles(RoleType.ADMIN, RoleType.PRODUCER, RoleType.MANUFACTURER, RoleType.DISTRIBUTOR, RoleType.OWNER, RoleType.RECYCLER)
    @ApiOperation({ summary: 'Get a battery by serial number' })
    @ApiResponse({
      status: 200,
      description: 'The found battery',
      type: BatteryDTO,
    })
    async getBattery(@Param('serialNumber') serialNumber: string): Promise<BatteryDTO> {
      return await this.batteryService.find({ where: { serialNumber } });
    }
  
    // Eliminar una batería por número de serie
    @Delete('/:serialNumber')
    @Roles(RoleType.ADMIN)
    @ApiOperation({ summary: 'Delete a battery' })
    @ApiResponse({
      status: 204,
      description: 'The battery has been successfully deleted.',
    })
    async deleteBattery(@Req() req: Request, @Param('serialNumber') serialNumber: string): Promise<void> {
      HeaderUtil.addEntityDeletedHeaders(req.res, 'Battery', serialNumber);
      const batteryToDelete = await this.batteryService.find({ where: { serialNumber } });
      await this.batteryService.delete(batteryToDelete);
    }
  }
  