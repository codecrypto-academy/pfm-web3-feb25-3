'use client';

import { MetaMaskInpageProvider } from "@metamask/providers";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ethers } from 'ethers';
import Image from "next/image";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function ConnectWallet() {
  const router = useRouter();
  const [account, setAccount] = useState('');

  const connectWallet = async () => {
    try {
      console.log('Estado de ethereum:', window.ethereum);
      console.log('¿MetaMask está instalado?:', typeof window.ethereum !== 'undefined');
      console.log('Estado de la conexión:', window.ethereum?.isConnected());
      // Verificar si MetaMask está instalado
      if (!window.ethereum ) {
        alert('Por favor, instala MetaMask');
        return;
      }

      // Solicitar acceso a la cuenta
      try {
        await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });
      } catch (connectError) {
        console.error('Error al solicitar cuentas:', connectError);
        alert('Error al conectar con MetaMask. Por favor, inténtalo de nuevo.');
        return;
      }

      // Crear provider después de la conexión exitosa
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      
      if (accounts.length > 0) {
        setAccount(accounts[0].address);
        
        try {
          // Mensaje para firmar
          const mensaje = "Confirma tu identidad para acceder al dashboard";
          const signer = await provider.getSigner();
          await signer.signMessage(mensaje);
          
          // Navegación usando el router de Next.js
          router.push('/dashboard');
        } catch (signError) {
          console.error('Error al firmar el mensaje:', signError);
          alert('Error durante el proceso de firma. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) {
      console.error('Error general:', error);
      alert('Error al conectar con MetaMask');
    }
  };

  return (
    <button
      onClick={connectWallet}
      className="fixed top-4 right-4 flex items-center gap-2 hover:underline hover:underline-offset-4 bg-blue-500 text-white px-4 py-2 rounded transition-colors hover:bg-blue-600 z-50"
      aria-label="Acceder al panel de control através de MetaMask"
    >
      <Image 
        src="/images/metamask.svg"  // La ruta comienza desde la carpeta public
        alt="Icono de MetaMask" 
        width={24} 
        height={24}
        priority
      />
      {account ? 'Conectado' : 'Conectar con MetaMask'}
    </button>
  );
}

export {};