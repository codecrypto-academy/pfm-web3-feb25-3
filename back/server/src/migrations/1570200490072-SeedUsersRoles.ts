import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
  role1: Authority = { name: 'ROLE_ADMIN' };
  role2: Authority = { name: 'ROLE_USER' };

  user1: User = {
    ethereumAddress: '0x1234567890123456789012345678901234567890',
    roles: ['ROLE_ADMIN', 'ROLE_USER'],
  };

  user2: User = {
    ethereumAddress: '0x9876543210987654321098765432109876543210',
    roles: ['ROLE_USER'],
  };

  user3: User = {
    ethereumAddress: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD',
    roles: ['ROLE_ADMIN'],
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    const authorityRepository = queryRunner.connection.getRepository('jhi_authority');
    await authorityRepository.save([this.role1, this.role2]);

    const userRepository = queryRunner.connection.getRepository('jhi_user');
    await userRepository.save([this.user1, this.user2, this.user3]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
