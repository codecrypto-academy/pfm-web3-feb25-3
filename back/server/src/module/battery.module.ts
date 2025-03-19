import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatteryController } from '../web/rest/battery.controller';
import { Battery } from '../domain/battery.entity';
import { BatteryService } from '../service/battery.service';
import { FabricClientModule } from './fabric-client.module';
import { AuthModule } from './auth.module';

@Module({
	imports: [TypeOrmModule.forFeature([Battery]), FabricClientModule, AuthModule],
	controllers: [BatteryController],
	providers: [BatteryService],
	exports: [BatteryService], 
})
export class BatteryModule {}
