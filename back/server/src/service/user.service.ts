import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { transformPassword } from '../security';
import { UserDTO } from './dto/user.dto';
import { UserMapper } from './mapper/user.mapper';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  async findById(id: string): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOneBy({ id });
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async findByFields(options: FindOneOptions<UserDTO>): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async find(options: FindManyOptions<UserDTO>): Promise<UserDTO | undefined> {
    const result = await this.userRepository.findOne(options);
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }

  async findAll(): Promise<UserDTO[]> {
    // Usamos find en lugar de findAndCount para obtener todos los usuarios sin contar
    const users = await this.userRepository.find();
    
    // Convertimos cada usuario a DTO y aplanamos las autoridades
    const usersDTO: UserDTO[] = users.map(user => 
      UserMapper.fromEntityToDTO(this.flatAuthorities(user))
    );
    
    return usersDTO;
  }
  

  async save(userDTO: UserDTO): Promise<UserDTO | undefined> {
    // Convertir el DTO en la entidad del usuario
    const user = this.convertInAuthorities(UserMapper.fromDTOtoEntity(userDTO));
  
    // Guardar el usuario en la base de datos (suponiendo que uses un repositorio o servicio para esto)
    const result = await this.userRepository.save(user);
  
    // Mapear la entidad guardada de nuevo a DTO y devolverla
    return UserMapper.fromEntityToDTO(this.flatAuthorities(result));
  }
  

  async update(userDTO: UserDTO): Promise<UserDTO | undefined> {
    return this.save(userDTO);
  }

  async delete(userDTO: UserDTO): Promise<UserDTO | undefined> {
    const user = UserMapper.fromDTOtoEntity(userDTO);
    const result = await this.userRepository.remove(user);
    return UserMapper.fromEntityToDTO(result);
  }

  private flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach(authority => authorities.push(authority.name));
      user.authorities = authorities;
    }
    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach(authority => authorities.push({ name: authority }));
      user.authorities = authorities;
    }
    return user;
  }
}
