'use client';

import { UserRegisterDTO } from '@/app/entity/dto/user-auth.dto';
import { UserType } from '@/app/entity/user.entity';
import axios from 'axios';
import React, { useState } from 'react';
import Web3 from 'web3';

// Mapeo de roles
const rolesMap: Record<string, { role: string; type: UserType }> = {
  'Fabricante': { role: 'ROLE_PRODUCER', type: UserType.PRODUCER },
  'Transportista': { role: 'ROLE_MANUFACTURER', type: UserType.VEHICLE_MANUFACTURER },
  'Distribuidor': { role: 'ROLE_DISTRIBUTOR', type: UserType.DISTRIBUTOR },
  'Usuario': { role: 'ROLE_USER', type: UserType.USER },
};

const Register = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [ethereumAddress, setEthereumAddress] = useState('');
  const [nonce, setNonce] = useState(0);
  const [signature, setSignature] = useState('');

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const connectMetamask = async () => {
    if (!window.ethereum) {
      alert('MetaMask no está instalado');
      return;
    }

    const web3 = new Web3(window.ethereum as any);

    try {
      // 1. Conectarse a Metamask
      const accounts: any = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (!accounts || accounts.length === 0) {
        alert('No se encontraron cuentas en MetaMask');
        return;
      }
      const account = accounts[0];
      setEthereumAddress(account);

      // 2. Generar nonce
      const nonce: number = Math.floor(Math.random() * 1000000);
      setNonce(nonce);

      // 3. Firmar nonce con Metamask
      const message = `Nonce: ${nonce}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, account]
      }) as string;
      setSignature(signature);

    } catch (error) {
      console.error('Error al conectar Metamask:', error);
    }
  };

  const handleSubmit = async () => {
    if (!rolesMap[selectedRole]) {
      console.error('Rol no válido');
      return;
    }

    const userData: UserRegisterDTO = { 
      ethereumAddress,
      roles: [rolesMap[selectedRole].role],
      type: rolesMap[selectedRole].type,
      firstName,
      lastName,
      companyName,
      nonce,
      signature
    };

    try {
      const response = await axios.post('http://localhost:8080/api/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        console.log('Usuario registrado con éxito');
      } else {
        console.error('Error en el registro');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className='flex justify-center mb-4'>
        <button 
          onClick={connectMetamask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Conectar con Metamask
        </button>
      </div>

      {ethereumAddress && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
          <p className="mb-4">Dirección: {ethereumAddress}</p>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Empresa</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700">
              <option value="">Selecciona un rol</option>
              {Object.keys(rolesMap).map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              disabled={!firstName || !lastName || !selectedRole}
            >
              Confirmar Registro
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
