import { Module } from '@nestjs/common';
import { FabricClient } from '../client/FabricClient';

@Module({
  providers: [
    {
      provide: FabricClient,
      useFactory: () => new FabricClient('basicts', 'mychannel'),
    },
  ],
  exports: [FabricClient],
})
export class FabricClientModule {}
