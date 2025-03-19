import { Module } from '@nestjs/common';
import { FabricChaincodeClient } from '../client/fabric-chaincode-client';
import { FabricCAClient } from '../client/fabric-ca-client';

@Module({
  providers: [
    {
      provide: FabricChaincodeClient,
      useFactory: () => new FabricChaincodeClient('basicts', 'mychannel'),
    },
    FabricCAClient, 
  ],
  exports: [FabricChaincodeClient, FabricCAClient],
})
export class FabricClientModule {}
