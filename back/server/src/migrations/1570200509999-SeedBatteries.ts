import { MigrationInterface, QueryRunner } from 'typeorm';
import { Battery } from '../domain/battery.entity';
import { BatteryStatus } from '../domain/enum/battery-status.enum';

export class SeedBatteries1670200490073 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const batteryRepository = queryRunner.connection.getRepository(Battery);

    // Crear baterías de prueba
    const battery1 = new Battery();
    battery1.serialNumber = 'BAT123456789';
    battery1.capacity = 75; // kWh
    battery1.manufacturerId = '0xabcdef1234567890abcdef1234567890abcdef12';
    battery1.currentOwnerId = '0x1234567890abcdef1234567890abcdef12345678';
    battery1.status = BatteryStatus.MANUFACTURED;
    battery1.location = 'Factory - China';

    const battery2 = new Battery();
    battery2.serialNumber = 'BAT987654321';
    battery2.capacity = 100;
    battery2.manufacturerId = '0x567890abcdef1234567890abcdef123456789012';
    battery2.currentOwnerId = '0x7890abcdef1234567890abcdef1234567890abcd';
    battery2.status = BatteryStatus.IN_TRANSIT;
    battery2.location = 'On Ship - Pacific Ocean';

    const battery3 = new Battery();
    battery3.serialNumber = 'BAT456789123';
    battery3.capacity = 85;
    battery3.manufacturerId = '0xabcdef567890abcdef1234567890abcdef123456';
    battery3.currentOwnerId = '0x234567890abcdef1234567890abcdef123456789';
    battery3.status = BatteryStatus.INSTALLED;
    battery3.location = 'Tesla Model S - California';

    const battery4 = new Battery();
    battery4.serialNumber = 'BAT321654987';
    battery4.capacity = 50;
    battery4.manufacturerId = '0xabcdef567890abcdef1234567890abcdef123456';
    battery4.currentOwnerId = '0x234567890abcdef1234567890abcdef123456789';
    battery4.status = BatteryStatus.RECYCLED;
    battery4.location = 'Recycling Plant - Germany';

    // Guardar las baterías en la base de datos
    await batteryRepository.save([battery1, battery2, battery3, battery4]);

    console.log('✅ Baterías creadas exitosamente');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const batteryRepository = queryRunner.connection.getRepository(Battery);
    await batteryRepository.clear();
    console.log('✅ Baterías eliminadas correctamente');
  }
}
