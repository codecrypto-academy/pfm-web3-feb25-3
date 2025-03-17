import { Module } from '@nestjs/common';
import { ContractsController } from '../web/rest/ContractsController';
import { FabricClientModule } from './fabric-client.module';
import { ContractService } from '../service/contract.service';

@Module({
    imports: [FabricClientModule],
    controllers: [ContractsController],
    providers: [ContractService],
    exports: [ContractService], 
  })
  export class ContractsModule {}