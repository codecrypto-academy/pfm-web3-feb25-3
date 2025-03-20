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
	UseInterceptors,
	UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BatteryService } from '../../service/battery.service';
import { BatteryDTO } from '../../service/dto/battery.dto';
import { Request } from '../../client/request';
import { HeaderUtil } from '../../client/header-util';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { JwtService } from '@nestjs/jwt'; // Para decodificar el JWT

@ApiTags('battery-resource')
@Controller('api/batteries')
@UseInterceptors(ClassSerializerInterceptor)
export class BatteryController {
	logger = new Logger('BatteryController');

	constructor(
		private readonly batteryService: BatteryService,
	) {}

	// Obtener todas las baterías - Requiere autenticación y rol de ADMIN
	@Get()
	@ApiOperation({ summary: 'Get the list of all batteries' })
	@ApiResponse({
		status: 200,
		description: 'List all batteries',
		type: [BatteryDTO],
	})
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.PRODUCER, RoleType.DISTRIBUTOR, RoleType.TRANSPORT, RoleType.OWNER) // Permite acceso a los roles mencionados
	async getAllBatteries(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user; // Access the authenticated user from the request
		this.logger.log(`User ${user.ethereumAddress} is requesting all batteries`);

		// Pasamos el usuario a la llamada del servicio de la batería
		const results: BatteryDTO[] = await this.batteryService.getAllBatteries(user);
		return results;
	}

	// Crear una nueva batería - Solo el fabricante puede crearla
	@Post('/')
	@ApiOperation({ summary: 'Create a new battery' })
	@ApiResponse({
		status: 201,
		description: 'The battery has been successfully created.',
		type: BatteryDTO,
	})
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.PRODUCER) // Solo el fabricante (PRODUCER) puede crear baterías
	async createBattery(@Req() req: Request, @Body() batteryDTO: BatteryDTO): Promise<BatteryDTO> {
		const user = req.user; // Access the authenticated user from the request
		this.logger.log(`User ${user.ethereumAddress} is creating a new battery`);

		// Llamamos al servicio para registrar la batería, pasando el usuario como parte de la transacción
		const created: BatteryDTO = await this.batteryService.registerBattery(
			user,
			batteryDTO
		);

		HeaderUtil.addEntityCreatedHeaders(req.res, 'Battery', created.id);
		return created;
	}

	// Obtener una batería por número de serie - Acceso público (sin requerir rol)
	@Get('/check/:serialNumber')
	@ApiOperation({ summary: 'Get a battery by serial number' })
	@ApiResponse({
		status: 200,
		description: 'The found battery',
		type: BatteryDTO,
	})
	async getBattery(@Param('serialNumber') serialNumber: string): Promise<BatteryDTO> {
		const battery: BatteryDTO = await this.batteryService.getBattery(serialNumber);
		return battery;
	}

	// Actualizar una batería - Solo el distribuidor o el propietario actual pueden actualizarla
	@Put('/')
	@ApiOperation({ summary: 'Update a battery' })
	@ApiResponse({
		status: 200,
		description: 'The battery has been successfully updated.',
		type: BatteryDTO,
	})
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.PRODUCER, RoleType.DISTRIBUTOR) // Distribuidor o productor pueden actualizar
	async updateBattery(@Req() req: Request, @Body() batteryDTO: BatteryDTO): Promise<BatteryDTO> {
		const user = req.user; // Access the authenticated user from the request
		this.logger.log(`User ${user.ethereumAddress} is updating battery ${batteryDTO.id}`);

		// Llamamos al servicio para actualizar la batería, pasando el usuario y el token
		const updatedBattery: BatteryDTO = await this.batteryService.updateBattery(batteryDTO, user);
		HeaderUtil.addEntityUpdatedHeaders(req.res, 'Battery', updatedBattery.id);
		return updatedBattery;
	}

	// Eliminar una batería - Solo el propietario o el administrador pueden eliminarla
	@Delete('/check/:serialNumber')
	@ApiOperation({ summary: 'Delete a battery by serial number' })
	@ApiResponse({
		status: 204,
		description: 'The battery has been successfully deleted.',
	})
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.ADMIN, RoleType.DISTRIBUTOR) // Administrador o distribuidor pueden eliminar
	async deleteBattery(@Req() req: Request, @Param('serialNumber') serialNumber: string): Promise<void> {
		const user = req.user; // Access the authenticated user from the request
		this.logger.log(`User ${user.ethereumAddress} is deleting battery with serial number ${serialNumber}`);

		await this.batteryService.getBattery(serialNumber);
		HeaderUtil.addEntityDeletedHeaders(req.res, 'Battery', serialNumber);
	}

	@Get('/producer')
	@ApiOperation({ summary: 'Obtiene baterías del productor' })
	@ApiResponse({ status: 200, description: 'Lista de baterías del productor', type: [BatteryDTO] })
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.PRODUCER)
	async getProducerBatteries(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user;
		this.logger.log(`User ${user.ethereumAddress} is fetching producer-related batteries`);
		return await this.batteryService.getProducerBatteries(user);
	}

	@Get('/distributor')
	@ApiOperation({ summary: 'Obtiene baterías del distribuidor' })
	@ApiResponse({ status: 200, description: 'Lista de baterías del distribuidor', type: [BatteryDTO] })
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.DISTRIBUTOR)
	async getDistributorBatteries(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user;
		this.logger.log(`User ${user.ethereumAddress} is fetching distributor-related batteries`);
		return await this.batteryService.getDistributorBatteries(user);
	}

	@Get('/owner')
	@ApiOperation({ summary: 'Obtiene baterías del propietario' })
	@ApiResponse({ status: 200, description: 'Lista de baterías del propietario', type: [BatteryDTO] })
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.OWNER)
	async getOwnerBatteries(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user;
		this.logger.log(`User ${user.ethereumAddress} is fetching owner-related batteries`);
		return await this.batteryService.getOwnerBatteries(user);
	}

	@Get('/available-for-owner')
	@ApiOperation({ summary: 'Obtiene baterías disponibles para propietario' })
	@ApiResponse({ status: 200, description: 'Lista de baterías disponibles para propietario', type: [BatteryDTO] })
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.OWNER)
	async getAvailableBatteriesForOwner(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user;
		this.logger.log(`User ${user.ethereumAddress} is fetching available batteries from distributors`);
		return await this.batteryService.getAvailableBatteriesForOwner();
	}

	@Get('/available-for-distributor')
	@ApiOperation({ summary: 'Obtiene baterías disponibles para distribuidor' })
	@ApiResponse({ status: 200, description: 'Lista de baterías disponibles para distribuidor', type: [BatteryDTO] })
	@UseGuards(AuthGuard, RolesGuard)
	@Roles(RoleType.DISTRIBUTOR)
	async getAvailableBatteriesForDistributor(@Req() req: Request): Promise<BatteryDTO[]> {
		const user = req.user;
		this.logger.log(`User ${user.ethereumAddress} is fetching available batteries from producers`);
		return await this.batteryService.getAvailableBatteriesForDistributor();
	}
}
