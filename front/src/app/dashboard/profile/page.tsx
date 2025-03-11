export default function Usuario() {
  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Datos del Usuario</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">Nombre:</label>
          <input 
            type="text"
            className="p-2 border rounded-md"
            placeholder="Tu nombre completo"
            disabled
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">NIF:</label>
          <input 
            type="text"
            className="p-2 border rounded-md"
            placeholder="12345678A"
            disabled
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium text-gray-600">Email:</label>
          <input 
            type="email"
            className="p-2 border rounded-md"
            placeholder="usuario@ejemplo.com"
            disabled
          />
        </div>
      </div>
    </div>
  );
}