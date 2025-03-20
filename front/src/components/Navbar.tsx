'use client';

import { useState, useEffect } from 'react';
import { getMetaMaskUserData } from '@/app/services/metaMaskService';
import { useAuth } from '@/app/hooks/useAuth';
import { RoleType, UserType } from '@/app/entity/user.entity';
import { UserRegisterDTO } from '@/app/entity/dto/user-auth.dto';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

const roleMappings: Record<UserType, RoleType[]> = {
  admin: [RoleType.ADMIN],
  user: [RoleType.USER],
  producer: [RoleType.PRODUCER],
  transporter: [RoleType.TRANSPORT],
  distributor: [RoleType.DISTRIBUTOR],
  owner: [RoleType.OWNER],
};

interface MetaMaskUserData {
  ethereumAddress: string[];
  signature: string;
  nonce: string;
}

const Navbar = () => {
  const [userData, setUserData] = useState<MetaMaskUserData | null>(null);
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { registerUser, login, logout, getUser, user } = useAuth();
  const router = useRouter();
  const { control, handleSubmit, setValue, watch } = useForm<{ userType: UserType; firstName: string; lastName: string; companyName: string; roles: RoleType[] }>({ defaultValues: { userType: '' as UserType, firstName: '', lastName: '', companyName: '', roles: [] } });
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  

  //agrgar metodo que llame a logout y haga lkuego push a /
  const handleLogout = () => {
    logout();
    router.push('/');
  }

  useEffect(() => {
    const userType = watch('userType');
    setValue('roles', roleMappings[userType] || []);
  }, [watch('userType')]);

  const connectMetamask = async () => {
    const data = await getMetaMaskUserData();
    if (data) {
      setUserData(data);
      setSelectedAccount(data.ethereumAddress[0]);
      try {
        await login(data.ethereumAddress[0], data.signature, data.nonce);
        router.push('/dashboard');
      } catch (error) {
        setIsModalOpen(true);
      }
    }
  };

  const onSubmit = async (formData: any) => {
    if (userData && selectedAccount) {
      const userRegisterData: UserRegisterDTO = {
        ethereumAddress: selectedAccount,
        signature: userData.signature,
        nonce: userData.nonce,
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        type: formData.userType,
        roles: formData.roles,
      };
      console.log('Datos de registro enviados:', userRegisterData);
      await registerUser(userRegisterData);
      setIsModalOpen(false);
      router.push('/dashboard');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50">
      <div className="text-lg font-bold">Car Battery Traceability</div>
      <div className="flex items-center gap-4">
        {user ? (
          <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Cerrar Sesión</button>
        ) : (
          <button onClick={connectMetamask} className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Image src="/images/metamask.svg" alt="MetaMask Icon" width={24} height={24} />
            {user ? 'Conectado' : 'Login con MetaMask'}
          </button>
        )}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">Registro</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller name="firstName" control={control} render={({ field }) => <input {...field} placeholder="Nombre" className="w-full border rounded p-2 bg-gray-800 text-white mb-2" />} />
              <Controller name="lastName" control={control} render={({ field }) => <input {...field} placeholder="Apellido" className="w-full border rounded p-2 bg-gray-800 text-white mb-2" />} />
              <Controller name="companyName" control={control} render={({ field }) => <input {...field} placeholder="Empresa" className="w-full border rounded p-2 bg-gray-800 text-white mb-2" />} />
              <Controller name="userType" control={control} render={({ field }) => (
                <select {...field} className="w-full border rounded p-2 bg-gray-800 text-white mb-4">
                  <option value="">Selecciona tipo de usuario</option>
                  {Object.keys(roleMappings).map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              )} />
              <div className="w-full border rounded p-2 bg-gray-800 text-white mb-4">
                <p className="mb-2">Roles asignados:</p>
                <ul>
                  {watch('roles').map((role) => (
                    <li key={role}>{role}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-1/2 bg-red-600 py-2 rounded hover:bg-red-700">Cancelar</button>
                <button type="submit" className="w-1/2 bg-green-600 py-2 rounded hover:bg-green-700">Registrarse</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;