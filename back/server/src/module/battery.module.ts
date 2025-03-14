import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryController } from '../web/rest/battery.controller';
import { Battery } from '../domain/battery.entity';
import { BatteryService } from '../service/battery.service';

@Module({
  imports: [TypeOrmModule.forFeature([Battery])],
  controllers: [BatteryController],
  providers: [BatteryService],
  exports: [BatteryService], 
})
export class BatteryModule {}
