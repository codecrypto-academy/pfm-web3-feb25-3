import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import { UserType } from '../domain/enum/user-type.enum';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
	roleAdmin: Authority = { name: 'ROLE_ADMIN' };
	roleUser: Authority = { name: 'ROLE_USER' }; 
	roleProducer: Authority = { name: 'ROLE_PRODUCER' }; // Fabricante // ORG 1
	roleManufacturer: Authority = { name: 'ROLE_MANUFACTURER' }; // Vehículo fabricante // ORG 1
	roleDistributor: Authority = { name: 'ROLE_DISTRIBUTOR' }; // Distribuidor // ORG 2
	roleOwner: Authority = { name: 'ROLE_OWNER' }; // Propietario // ORG 2
	roleTrasnport: Authority = { name: 'ROLE_TRANSPORT' }; // Transportista // ORG 2
	roleRecycler: Authority = { name: 'ROLE_RECYCLER' }; // Reciclador // ORG 2

	public async up(queryRunner: QueryRunner): Promise<void> {
		const authorityRepository = queryRunner.connection.getRepository(Authority);
		const userRepository = queryRunner.connection.getRepository(User);

		// Guardar roles en la base de datos y obtener referencias
		const adminRole = await authorityRepository.save(this.roleAdmin);
		const userRole = await authorityRepository.save(this.roleUser);
		const producerRole = await authorityRepository.save(this.roleProducer);
		const manufacturerRole = await authorityRepository.save(this.roleManufacturer);
		const distributorRole = await authorityRepository.save(this.roleDistributor);
		const ownerRole = await authorityRepository.save(this.roleOwner);
		const recyclerRole = await authorityRepository.save(this.roleRecycler);

		// Crear usuarios con sus roles
		const user1 = new User();
		user1.ethereumAddress = '0x1234567890abcdef1234567890abcdef12345678';
		user1.type = UserType.ADMIN;
		user1.roles = [adminRole, userRole];

		const user2 = new User();
		user2.ethereumAddress = '0xabcdef1234567890abcdef1234567890abcdef12';
		user2.type = UserType.OWNER;
		user2.roles = [userRole, ownerRole];

		const user3 = new User();
		user3.ethereumAddress = '0x567890abcdef1234567890abcdef123456789012';
		user3.type = UserType.PRODUCER;
		user3.roles = [producerRole];

		const user4 = new User();
		user4.ethereumAddress = '0xabcdef567890abcdef1234567890abcdef123456';
		user4.type = UserType.VEHICLE_MANUFACTURER;
		user4.roles = [manufacturerRole];

		const user5 = new User();
		user5.ethereumAddress = '0x7890abcdef1234567890abcdef1234567890abcd';
		user5.type = UserType.DISTRIBUTOR;
		user5.roles = [distributorRole];

		const user6 = new User();
		user6.ethereumAddress = '0x234567890abcdef1234567890abcdef123456789';
		user6.type = UserType.RECYCLER;
		user6.roles = [recyclerRole];

		// Guardar los usuarios en la base de datos
		await userRepository.save([user1, user2, user3, user4, user5, user6]);

		console.log('✅ Usuarios y roles creados exitosamente');
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		const userRepository = queryRunner.connection.getRepository(User);
		const authorityRepository = queryRunner.connection.getRepository(Authority);

		// Eliminar usuarios y roles
		await userRepository.clear();
		await authorityRepository.clear();

		console.log('✅ Usuarios y roles eliminados correctamente');
	}
}
