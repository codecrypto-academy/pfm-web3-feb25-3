import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDTO } from '../../service/dto/user.dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Obtenemos los roles requeridos desde las metadatas del manejador
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // Si no hay roles definidos, permitimos el acceso
    if (!roles) {
      return true;
    }

    // Obtenemos la solicitud y el usuario desde el contexto
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserDTO;

    // Verificamos que el usuario tenga los roles requeridos
    return user && user.roles && user.roles.some(role => roles.indexOf(role) >= 0);
  }
}
