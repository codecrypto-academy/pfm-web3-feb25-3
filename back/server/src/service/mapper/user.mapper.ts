import { ObjectId } from 'mongodb';
import { User } from '../../domain/user.entity';
import { UserDTO } from '../dto/user.dto';

/**
 * User Mapper object.
 */
export class UserMapper {
  
  static fromEntityToDTO(user: User): UserDTO {
    if (!user) return null;

    const userDTO = new UserDTO();
    userDTO.id = user._id?.toHexString();
    userDTO.ethereumAddress = user.ethereumAddress;
    
    // Usamos flatAuthorities para convertir los roles de Authority a string[]
    userDTO.roles = this.flatAuthorities(user);

    userDTO.type = user.type;
    userDTO.firstName = user.firstName;
    userDTO.lastName = user.lastName;
    userDTO.companyName = user.companyName;

    return userDTO;
}

static fromDTOtoEntity(userDTO: UserDTO): User {
  if (!userDTO) return null;

  const user = new User();
  user._id = userDTO.id ? new ObjectId(userDTO.id) : undefined;
  user.ethereumAddress = userDTO.ethereumAddress;

  // Convertir roles de string[] a Authority[]
  user.roles = this.convertInAuthorities(userDTO);
  
  user.type = userDTO.type;
  user.firstName = userDTO.firstName;
  user.lastName = userDTO.lastName;
  user.companyName = userDTO.companyName;

  return user;
}


private static flatAuthorities(user: User): string[] {
    // Convierte roles de Authority a un array de strings (roles.name)
    return user.roles?.map(role => role.name) || [];
}

private static convertInAuthorities(userDTO: UserDTO): any[] {
    // Convierte los roles de string[] a Authority[]
    return userDTO.roles?.map(role => ({ name: role })) || [];
}

}
