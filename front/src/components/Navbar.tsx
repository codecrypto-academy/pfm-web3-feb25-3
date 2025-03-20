'use client';

import { useState } from 'react';
import { getMetaMaskUserData } from '@/app/services/metaMaskService';
import { useAuthContext } from '@/app/context/AuthContext';
import { RoleType, UserType } from '@/app/entity/user.entity';
import { UserRegisterDTO } from '@/app/entity/dto/user-auth.dto';
import Image from 'next/image';
import { useAuth } from '@/app/hooks/useAuth';

const roleMappings: Record<UserType, RoleType[]> = {
  admin: [RoleType.ADMIN],
  user: [RoleType.USER],
  producer: [RoleType.PRODUCER],
  transporter: [RoleType.TRANSPORT],
  distributor: [RoleType.DISTRIBUTOR],
  owner: [RoleType.OWNER],
};

const Navbar = () => {
  const [userData, setUserData] = useState<{ ethereumAddress: string[]; signature: string; nonce: string } | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userType, setUserType] = useState<UserType | ''>('');
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [accounts, setAccounts] = useState<string[]>([]); // Almacena las cuentas disponibles
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null); // Cuenta seleccionada
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar la visibilidad del modal
  const { registerUser, logout, login, user } = useAuth();

  // Llama a MetaMask para obtener todas las cuentas disponibles y configurarlas
  const connectMetamask = async () => {
    const data = await getMetaMaskUserData();
    if (data) {
      setUserData(data);
      setAccounts(data.ethereumAddress); // Configura las cuentas en el estado
      setSelectedAccount(data.ethereumAddress[0]); // Selecciona la primera cuenta por defecto
      setIsModalOpen(true); // Abre el modal automáticamente
    }
  };

  // Obtener las cuentas disponibles y permitir al usuario seleccionar una
  const handleSelectAccount = (account: string) => {
    setSelectedAccount(account);
  };

  const handleRegister = async () => {
    if (userData && selectedAccount) {
      const userRegisterData: UserRegisterDTO = {
        ethereumAddress: selectedAccount,
        signature: userData.signature,
        nonce: userData.nonce,
        firstName,
        lastName,
        companyName,
        type: userType as UserType,
        roles,
      };

      await registerUser(userRegisterData);
      closeModal(); // Cierra el modal después de registrarse
    }
  };

  // Cierra el modal de registro
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50">
      <div className="text-lg font-bold">CarBatteryTraceability</div>
      <div className="flex gap-4">
        <button
          onClick={connectMetamask}
          className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          <Image 
            src="/images/metamask.svg"  
            alt="Icono de MetaMask" 
            width={24} 
            height={24}
          />
          {selectedAccount ? 'Conectado' : 'Login con MetaMask'}
        </button>
      </div>

      {/* Modal de registro */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Formulario de Registro</h2>

            {/* Si hay cuentas disponibles, mostramos una lista para que el usuario seleccione */}
            {accounts.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Selecciona una cuenta</h3>
                <select
                  value={selectedAccount || ''}
                  onChange={(e) => handleSelectAccount(e.target.value)}
                  className="w-full border rounded p-2 bg-gray-800 text-white"
                >
                  <option value="">Selecciona una cuenta</option>
                  {accounts.map((account) => (
                    <option key={account} value={account}>
                      {account}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <input
              type="text"
              placeholder="Nombre"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded p-2 bg-gray-800 text-white mb-2"
            />
            <input
              type="text"
              placeholder="Apellido"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded p-2 bg-gray-800 text-white mb-2"
            />
            <input
              type="text"
              placeholder="Nombre de la empresa"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full border rounded p-2 bg-gray-800 text-white mb-2"
            />
            <select
              value={userType}
              onChange={(e) => setUserType(e.target.value as UserType)}
              className="w-full border rounded p-2 bg-gray-800 text-white mb-4"
            >
              <option value="">Selecciona el tipo de usuario</option>
              {Object.keys(roleMappings).map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="border p-4 rounded bg-gray-800 mb-4">
              <h3 className="text-sm font-semibold mb-2">Roles asignados:</h3>
              <ul>
                {roles.map((role) => (
                  <li key={role} className="text-gray-300">{role}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="w-1/2 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleRegister}
                className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Registrarse
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
