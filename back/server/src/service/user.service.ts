import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { UserDTO } from './dto/user.dto';
import { UserMapper } from './mapper/user.mapper';
import { ObjectId } from 'mongodb';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name); // 👈 Inyectamos Logger en el servicio

  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findById(id: string): Promise<UserDTO | undefined> {
    try {
      this.logger.debug(`🔍 Buscando usuario con ID: ${id}`);

      // Convertir ID de string a ObjectId
      const objectId = new ObjectId(id);
      const result = await this.userRepository.findOneBy({ _id: objectId });

      if (!result) {
        this.logger.warn(`⚠️ Usuario con ID ${id} no encontrado.`);
        return undefined;
      }

      this.logger.log(`✅ Usuario con ID ${id} encontrado.`);
      return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
    } catch (error) {
      this.logger.error(`❌ Error en findById(${id}):`, error);
      throw new Error("No se pudo obtener el usuario. Inténtalo de nuevo más tarde.");
    }
  }

  async findByFields(options: FindOneOptions<User>): Promise<UserDTO | undefined> {
    this.logger.debug(`🔍 Buscando usuario con opciones: ${JSON.stringify(options)}`);
    const result = await this.userRepository.findOne(options);
    if (!result) {
      this.logger.warn(`⚠️ Usuario no encontrado con opciones: ${JSON.stringify(options)}`);
      return undefined;
    }
    this.logger.log(`✅ Usuario encontrado con opciones: ${JSON.stringify(options)}`);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async find(options: FindManyOptions<User>): Promise<UserDTO | undefined> {
    this.logger.debug(`🔍 Buscando usuario con opciones: ${JSON.stringify(options)}`);
    const result = await this.userRepository.findOne(options);
    if (!result) {
      this.logger.warn(`⚠️ Usuario no encontrado con opciones: ${JSON.stringify(options)}`);
      return undefined;
    }
    this.logger.log(`✅ Usuario encontrado con opciones: ${JSON.stringify(options)}`);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async findAll(): Promise<UserDTO[]> {
    this.logger.debug("🔍 Obteniendo todos los usuarios...");

    const users = await this.userRepository.find();
    if (users.length === 0) {
      this.logger.warn("⚠️ No se encontraron usuarios en la base de datos.");
      return [];
    }

    this.logger.log(`✅ Se encontraron ${users.length} usuarios.`);
    return users.map(user => UserMapper.fromEntityToDTO(this.flatAuthorities(user)));
  }

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    this.logger.debug(`💾 Guardando usuario: ${JSON.stringify(userDTO)}`);

    const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
    const result = await this.userRepository.save(user);

    this.logger.log(`✅ Usuario guardado con éxito. ID: ${result._id?.toHexString()}`);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async update(userDTO: UserDTO): Promise<UserDTO | undefined> {
    this.logger.debug(`🔄 Actualizando usuario: ${JSON.stringify(userDTO)}`);
    return this.save(userDTO);
  }

  async delete(userDTO: UserDTO): Promise<UserDTO | undefined> {
    this.logger.debug(`🗑️ Eliminando usuario con ID: ${userDTO.id}`);

    const user = UserMapper.fromDTOtoEntity(userDTO);
    const result = await this.userRepository.remove(user);

    this.logger.log(`✅ Usuario con ID ${userDTO.id} eliminado correctamente.`);
    return UserMapper.fromEntityToDTO(result);
  }

  private flatAuthorities(user: any): User {
    if (user && user.roles) {
      const authorities: string[] = [];
      user.roles.forEach(authority => authorities.push(authority.name));
      user.roles = authorities;
    }
    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.roles) {
      const authorities: any[] = [];
      user.roles.forEach(authority => authorities.push({ name: authority }));
      user.roles = authorities;
    }
    return user;
  }
}
