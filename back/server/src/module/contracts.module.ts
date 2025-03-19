import { Module } from '@nestjs/common';
import { ContractsController } from '../web/rest/ContractsController';
import { FabricClientModule } from './fabric-client.module';
import { ContractService } from '../service/contract.service';
import { UserModule } from './user.module';

@Module({
    imports: [FabricClientModule, UserModule],
    controllers: [ContractsController],
    providers: [ContractService],
    exports: [ContractService], 
  })
  export class ContractsModule {}