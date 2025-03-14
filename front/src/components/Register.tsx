'use client';

import axios from 'axios';
import React, { useState } from 'react';

// Enum de tipos de usuario
export enum UserType {
  ADMIN = 'admin',
  USER = 'user',
  PRODUCER = 'producer',
  VEHICLE_MANUFACTURER = 'vehicle_manufacturer',
  DISTRIBUTOR = 'distributor',
  OWNER = 'owner',
  RECYCLER = 'recycler',
}

// Interfaz User
interface User {
  ethereumAddress: string;
  roles: string[];
  type?: UserType;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

// Definición de roles
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
  const [showMetamaskMessage, setShowMetamaskMessage] = useState(false);

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleSubmit = async () => {
    if (!rolesMap[selectedRole]) {
      console.error('Rol no válido');
      return;
    }

    const userData: User = {
      ethereumAddress,
      roles: [rolesMap[selectedRole].role],
      type: rolesMap[selectedRole].type,
      firstName,
      lastName,
      companyName,
    };

    try {
      const response = await axios.post('http://localhost:8080/api/register', userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        console.log('Usuario registrado con éxito', userData);
        setShowMetamaskMessage(true);
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
          onClick={handleToggleForm}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Registrar
        </button>
      </div>

      {showForm && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Ingrese su nombre" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Ingrese su apellido" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Empresa</label>
            <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Ingrese el nombre de la empresa" />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Dirección Ethereum</label>
            <input type="text" value={ethereumAddress} onChange={(e) => setEthereumAddress(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" placeholder="Ingrese su dirección Ethereum" />
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
              disabled={!firstName || !lastName || !ethereumAddress || !selectedRole}
            >
              Confirmar Registro
            </button>
          </div>
        </div>
      )}

      {showMetamaskMessage && (
        <div className="mt-4 p-4 border rounded-lg bg-green-500 text-white font-bold">
          <button onClick={() => setShowMetamaskMessage(false)} className="bg-green-700 hover:bg-green-900 p-2 rounded">Puede conectarse a Metamask</button>
        </div>
      )}
    </div>
  );
};

export default Register;
