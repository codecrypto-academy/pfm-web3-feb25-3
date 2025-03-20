'use client';

import { useState, useEffect } from 'react';
import { getMetaMaskUserData } from '@/app/services/metaMaskService';
import { useAuth } from '@/app/hooks/useAuth';
import { UserType } from '@/app/entity/user.entity';
import { UserRegisterDTO } from '@/app/entity/dto/user-auth.dto';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

const roleOptions = [
  { label: 'Admin', value: 'ROLE_ADMIN' },
  { label: 'User', value: 'ROLE_USER' },
  { label: 'Producer', value: 'ROLE_PRODUCER' },
  { label: 'Transporter', value: 'ROLE_TRANSPORT' },
  { label: 'Distributor', value: 'ROLE_DISTRIBUTOR' },
  { label: 'Owner', value: 'ROLE_OWNER' },
];

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
  const { control, handleSubmit, setValue, watch } = useForm<{ userType: string; firstName: string; lastName: string; companyName: string; roles: string[] }>({ defaultValues: { userType: '', firstName: '', lastName: '', companyName: '', roles: [] } });
  
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

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
        roles: formData.roles || [],
      };
      console.log('Datos de registro enviados:', userRegisterData);
      await registerUser(userRegisterData);
      setIsModalOpen(false);
      router.push('/dashboard');
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center fixed w-full top-0 left-0 z-50">
      <div className="text-lg font-bold">CarBatteryTraceability</div>
      <div className="flex items-center gap-4">
        {user ? (
          <button onClick={logout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Cerrar Sesión</button>
        ) : (
          <button onClick={connectMetamask} className="flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            <Image src="/images/metamask.svg" alt="MetaMask Icon" width={24} height={24} />
            {selectedAccount ? 'Conectado' : 'Login con MetaMask'}
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
                  {roleOptions.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              )} />
              <Controller name="roles" control={control} render={({ field }) => (
                <div className="w-full border rounded p-2 bg-gray-800 text-white mb-4">
                  <p className="mb-2">Selecciona los roles:</p>
                  {roleOptions.map((role) => (
                    <label key={role.value} className="block">
                      <input
                        type="checkbox"
                        value={role.value}
                        checked={Array.isArray(field.value) && field.value.includes(role.value)}
                        onChange={(e) => {
                          const updatedRoles = e.target.checked
                            ? [...(Array.isArray(field.value) ? field.value : []), role.value]
                            : (Array.isArray(field.value) ? field.value.filter((r) => r !== role.value) : []);
                          setValue('roles', updatedRoles);
                        }}
                      /> {role.label}
                    </label>
                  ))}
                </div>
              )} />
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