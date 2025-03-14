import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import { Authority } from '../domain/authority.entity';
import { UserService } from '../service/user.service';
import { UserDTO } from './dto/user.dto';

import { compareSignature } from '../../utils/signature-utils'; 
import { ObjectId } from 'mongodb';


@Injectable()
export class AuthService {
	logger = new Logger('AuthService');
	constructor(
		private readonly jwtService: JwtService,
		@InjectRepository(Authority) private authorityRepository: Repository<Authority>,
		private readonly userService: UserService,
	) {}

	async login(userLogin: UserLoginDTO): Promise<any> {
		const { ethereumAddress, signature, nonce } = userLogin;

		if (!ethereumAddress || !signature || !nonce) {
			throw new HttpException('Ethereum address, signature, and nonce are required!', HttpStatus.BAD_REQUEST);
		}

		// Encontramos al usuario por la dirección Ethereum
		const userFind = await this.userService.findByFields({ where: { ethereumAddress } });

		if (!userFind) {
			throw new HttpException('User not found!', HttpStatus.UNAUTHORIZED);
		}

		// Verificamos que la firma coincida con el mensaje
		const validSignature = await compareSignature(nonce, signature, ethereumAddress);
		if (!validSignature) {
			throw new HttpException('Invalid signature!', HttpStatus.UNAUTHORIZED);
		}

		const user = await this.findUserWithAuthById(userFind.id.toString());


		const payload = { id: user.id, ethereumAddress: user.ethereumAddress, authorities: user.roles };

		return {
			id_token: this.jwtService.sign(payload),
		};
	}
c


	/* eslint-enable */
	async validateUser(payload: Payload): Promise<UserDTO | undefined> {
		return await this.findUserWithAuthById(payload.id);
	}

	async findUserWithAuthById(userId: string): Promise<UserDTO | undefined> {
		const userDTO: UserDTO = await this.userService.findById(userId);
		return userDTO;
	}

	async getAccount(userId: string): Promise<UserDTO | undefined> {
		const userDTO: UserDTO = await this.findUserWithAuthById(userId);
		if (!userDTO) {
			return;
		}
		return userDTO;
	}



	async registerNewUser(newUser: UserDTO): Promise<UserDTO> {
		// Verificar si la dirección Ethereum ya está registrada
		let userFind: UserDTO = await this.userService.findByFields({ where: { ethereumAddress: newUser.ethereumAddress } });

		// Si la dirección Ethereum ya existe, lanzamos un error
		if (userFind) {
			throw new HttpException('Ethereum address is already in use!', HttpStatus.BAD_REQUEST);
		}

		// Definir el rol por defecto del usuario (por ejemplo, 'ROLE_USER')
		newUser.roles = ['ROLE_USER'];

		// Aquí puedes guardar el usuario. Podrías hacerlo por medio de un servicio.
		const user: UserDTO = await this.userService.save(newUser);

		return user;
	}




	async getAllUsers(): Promise<UserDTO[]> {
		return await this.userService.findAll();
	}
}
