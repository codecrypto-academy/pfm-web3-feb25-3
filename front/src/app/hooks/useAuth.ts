import { registerUserService } from './../services/userService';
import { useState, useEffect } from 'react';
import { authenticateUser, getAuthenticatedUser } from '../services/authService';
import { User } from '../entity/user.entity';
import { UserRegisterDTO } from '../entity/dto/user-auth.dto';


export const useAuth = () => {

	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	const login = async (ethereumAddress: string, signature: string, nonce: string) => {
		const token = await authenticateUser(ethereumAddress, signature, nonce);
		localStorage.setItem('jwt', token);
    localStorage.setItem('address', ethereumAddress);
		const userData: User = await getAuthenticatedUser();
		setUser(userData);
	};

	const registerUser = async (user: UserRegisterDTO) => {
		await registerUserService(user);
		await login(user.ethereumAddress, user.signature, user.nonce);
	};

	const logout = () => {
		localStorage.removeItem('jwt');
		localStorage.removeItem('address');
		setUser(null);
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData: User = await getAuthenticatedUser();
				setUser(userData);
			} catch (error) {
				console.error('No hay token o token inválido');
			} finally {
				setLoading(false);
			}
		};

		const token = localStorage.getItem('jwt');
		if (token) {
			fetchUser();
		} else {
			setLoading(false);
		}
	}, []);

	return { user, loading, login, registerUser, logout };
};
