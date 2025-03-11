import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
	roleAdmin: Authority = { name: 'ROLE_ADMIN' };
	roleUser: Authority = { name: 'ROLE_USER' };
	roleProducer: Authority = { name: 'ROLE_PRODUCER' };
	roleManufacturer: Authority = { name: 'ROLE_MANUFACTURER' };
	roleDistributor: Authority = { name: 'ROLE_DISTRIBUTOR' };
	roleOwner: Authority = { name: 'ROLE_OWNER' };
	roleRecycler: Authority = { name: 'ROLE_RECYCLER' };




	public async up(queryRunner: QueryRunner): Promise<void> {
		const authorityRepository = queryRunner.connection.getRepository('jhi_authority');
    await authorityRepository.save([
      this.roleAdmin,
      this.roleUser,
      this.roleProducer,
      this.roleManufacturer,
      this.roleDistributor,
      this.roleOwner,
      this.roleRecycler
    ]);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {}
}
