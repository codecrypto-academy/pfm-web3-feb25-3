import { Controller, UseInterceptors, ClassSerializerInterceptor, Get, Req, Logger, Post, Body, Param } from "@nestjs/common";
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

	@Get('/ping/:address')
	async pingContract(@Param('address') address: string): Promise<string> {
		return this.contractService.pingContract(address);
	}
	
}
