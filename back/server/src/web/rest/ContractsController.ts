import { Controller, UseInterceptors, ClassSerializerInterceptor, Get, Req, Logger, Post, Body } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LoggingInterceptor } from "../../client/interceptors/logging.interceptor";
import { ContractService } from "../../service/contract.service";
import { BatteryDTO } from "../../service/dto/battery.dto";

@Controller('api/contracts')
@UseInterceptors(LoggingInterceptor, ClassSerializerInterceptor)
@ApiBearerAuth()
@ApiTags('contracts-resource')
export class ContractsController {

	logger = new Logger('ContractsController');
	constructor(private readonly contractService: ContractService) {}

    @Post('transfer-battery')
    async transferBattery(@Body() body: { batteryId: string; newOwner: string }) {
      return this.contractService.transferBattery(body.batteryId, body.newOwner);
    }

    @Post('register-battery')
    @ApiOperation({ summary: 'Registrar una nueva batería en la blockchain' })
    @ApiResponse({ status: 201, description: 'Batería registrada correctamente' })
    async registerBattery(@Body() body: { id: string }) {
      return this.contractService.registerBattery(body.id);
    }
}
