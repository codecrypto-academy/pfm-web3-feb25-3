import { useState, useEffect } from 'react';
import { authenticateUser, getAuthenticatedUser } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (ethereumAddress: string, signature: string, nonce: string) => {
    const token = await authenticateUser(ethereumAddress, signature, nonce);
    localStorage.setItem('jwt', token);
    const userData = await getAuthenticatedUser();
    setUser(userData);
  };

  const logout = async () => {
    try {
      // Limpiar el estado de autenticación
      setUser(null);
      // Limpiar el token si lo almacenas en localStorage
      localStorage.removeItem('token');
      // Redirigir al inicio
      window.location.href = '/';
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getAuthenticatedUser();
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

  return { user, loading, login, logout };
};
