'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import { useState } from 'react';
import { getMetaMaskUserData } from '@/app/services/metaMaskService';
import { authenticateUser } from '@/app/services/authService';
import Image from "next/image";
import { useRouter } from 'next/navigation';

const ConnectWallet = () => {
  const router = useRouter();
  const { login } = useAuthContext();
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    const userData = await getMetaMaskUserData();
    if (!userData) {
      alert('No se pudo obtener los datos de MetaMask');
      return;
    }

    try {
      // Llamar al hook de autenticación en lugar del servicio directo
      await login(userData.ethereumAddress, userData.signature, userData.nonce);
      setAccount(userData.ethereumAddress);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error al autenticar:', error);
      alert('Error al autenticar con MetaMask');
    }
  };
  return (
    <button
      onClick={connectWallet}
      className="fixed top-4 right-4 flex items-center gap-2 hover:underline hover:underline-offset-4 bg-blue-500 text-white px-4 py-2 rounded transition-colors hover:bg-blue-600 z-50"
      aria-label="Iniciar sesión con MetaMask"
    >
      <Image 
        src="/images/metamask.svg"  
        alt="Icono de MetaMask" 
        width={24} 
        height={24}
        priority
      />
      {account ? 'Conectado' : 'Login con MetaMask'}
    </button>
  );
};

export default ConnectWallet;
