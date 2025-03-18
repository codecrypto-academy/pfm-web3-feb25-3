import { Module } from '@nestjs/common';
import { FabricClient } from '../client/fabric-chaincode-client';
import { FabricCAClient } from '../client/fabric-ca-client';

@Module({
  providers: [
    {
      provide: FabricClient,
      useFactory: () => new FabricClient('basicts', 'mychannel'),
    },
    FabricCAClient, 
  ],
  exports: [FabricClient, FabricCAClient],
})
export class FabricClientModule {}
