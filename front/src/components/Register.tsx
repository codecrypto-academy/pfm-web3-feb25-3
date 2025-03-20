'use client';

import { useAuthContext } from '@/app/context/AuthContext';
import { useState } from 'react';
import { getMetaMaskUserData } from '@/app/services/metaMaskService';
import { registerUser } from '@/app/services/userService';
import { UserType } from '@/app/entity/user.entity';
import { UserRegisterDTO } from '@/app/entity/dto/user-auth.dto';

const roleMappings: { [key: string]: string } = {
  admin: 'ROLE_ADMIN',
  user: 'ROLE_USER',
  producer: 'ROLE_PRODUCER',//Fabrica
  //vehicle_manufacturer: 'ROLE_MANUFACTURER',
  distributor: 'ROLE_DISTRIBUTOR',//retailer
  owner: 'ROLE_OWNER',//usuario
  //recycler: 'ROLE_RECYCLER',
  transporter: 'ROLE_TRANSPORTER',
};

const Register = () => {
  const [userData, setUserData] = useState<{ ethereumAddress: string; signature: string; nonce: string } | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userType, setUserType] = useState<UserType | ''>('');
  const [roles, setRoles] = useState<string[]>([]);
  const { login } = useAuthContext();

  const connectMetamask = async () => {
    const data = await getMetaMaskUserData();
    if (data) {
      setUserData(data);
    }
  };

  const handleRoleChange = (role: string) => {
    setRoles((prevRoles) =>
      prevRoles.includes(roleMappings[role])
        ? prevRoles.filter((r) => r !== roleMappings[role])
        : [...prevRoles, roleMappings[role]]
    );
  };

  const handleRegister = async () => {
    if (userData) {
      const userRegisterData: UserRegisterDTO = {
        ethereumAddress: userData.ethereumAddress,
        signature: userData.signature,
        nonce: userData.nonce,
        firstName,
        lastName,
        companyName,
        type: userType as UserType,
        roles,
      };
      
      await registerUser(userRegisterData);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-900 text-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Registro de Usuario</h2>
      <button
        onClick={connectMetamask}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4"
      >
        Conectar con MetaMask
      </button>
      {userData && (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full border rounded p-2 bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full border rounded p-2 bg-gray-800 text-white"
          />
          <input
            type="text"
            placeholder="Nombre de la empresa"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border rounded p-2 bg-gray-800 text-white"
          />
          <select
            value={userType}
            onChange={(e) => setUserType(e.target.value as UserType)}
            className="w-full border rounded p-2 bg-gray-800 text-white"
          >
            <option value="">Selecciona el tipo de usuario</option>
            {Object.values(UserType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <div className="border p-4 rounded bg-gray-800">
            <h3 className="text-sm font-semibold mb-2">Selecciona los roles:</h3>
            {Object.keys(roleMappings).map((role) => (
              <label key={role} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={role}
                  checked={roles.includes(roleMappings[role])}
                  onChange={() => handleRoleChange(role)}
                />
                {role}
              </label>
            ))}
          </div>
          <button
            onClick={handleRegister}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Registrarse
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;