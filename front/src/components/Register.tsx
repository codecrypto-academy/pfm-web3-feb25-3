'use client';

import React, { useState } from 'react';

interface ClientData {
  name: string;
  address: string;
  email: string;
  role: string;
}

const Register = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [datosClient, setDatosClient] = useState<ClientData | null>(null);
  const [showMetamaskMessage, setShowMetamaskMessage] = useState(false);

  const roles = [
    'Fabricante',
    'Transportista',
    'Distribuidor',
    'Usuario'
  ];

  const handleToggleForm = () => {
    setShowForm(!showForm);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(event.target.value);
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = () => {
    const clientData: ClientData = {
      name: name,
      address: address,
      email: email,
      role: selectedRole
    };
    setDatosClient(clientData);
    setShowForm(false);
    setShowMetamaskMessage(true); // Mostrar mensaje de Metamask
    console.log('Datos guardados:', clientData); // Para verificar los datos
  };

  return (
    <div className="w-full max-w-md">
      <button 
        onClick={handleToggleForm}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Registrar
      </button>

      {showForm && (
        <div className="mt-4 p-4 border rounded-lg shadow-md bg-white">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese su nombre"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={handleAddressChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese su dirección"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Ingrese su email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rol
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="shadow border rounded w-full py-2 px-3 text-gray-700"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={!name || !address || !selectedRole}
            >
              Confirmar Registro
            </button>
          </div>
        </div>
      )}

      {datosClient && (
        <div className="mt-4 p-4 border rounded-lg bg-black-300">
          <h3 className="font-bold text-center-green-600">¡Registro Exitoso!</h3>
          <div className="mt-2">
            <p>Nombre: {datosClient.name}</p>
            <p>Dirección: {datosClient.address}</p>
            <p>Rol: {datosClient.role}</p>
          </div>
          {showMetamaskMessage && (
            <div className="bg-green-500 text-white font-bold p-2 rounded inline-block">
              <button 
                className="bg-green-500 hover:bg-green-700 text-white font-bold p3 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  console.log('Conectarse a Metamask');
                  setDatosClient(null);
                  setShowMetamaskMessage(false);
                }}
              >
                Puede conectarse a Metamask
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Register;