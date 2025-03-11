import { ObjectId } from 'mongodb';
import { User } from '../../domain/user.entity';
import { UserDTO } from '../dto/user.dto';

/**
 * User Mapper object.
 */
export class UserMapper {
  
  static fromDTOtoEntity(userDTO: UserDTO): User {
    if (!userDTO) {
      return;
    }

    const user = new User();
    
    // ✅ Convertir `id` a `_id` correctamente
    if (userDTO.id) {
      user._id = new ObjectId(userDTO.id);
    } else {
      user._id = undefined; // Asegurar que no sea null
    }

    user.ethereumAddress = userDTO.ethereumAddress;
    user.roles = userDTO.roles;

    return user;
  }

  static fromEntityToDTO(user: User): UserDTO {
    if (!user) {
      return;
    }
    
    const userDTO = new UserDTO();
    
    // ✅ Convertir `_id` a `id` en el DTO
    userDTO.id = user._id?.toHexString(); 
    userDTO.ethereumAddress = user.ethereumAddress;
    userDTO.roles = user.roles;

    return userDTO;
  }
}
