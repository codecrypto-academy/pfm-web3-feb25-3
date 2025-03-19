🚗🔋 Plataforma de Trazabilidad de Baterías de Coches Eléctricos con Hyperledger Fabric
🎯 Objetivo
Crear un sistema descentralizado que permita rastrear el ciclo de vida de las baterías desde la producción hasta su reciclaje, asegurando autenticidad, sostenibilidad y cumplimiento normativo.


Los siguientes Roles son los siguientes:
  admin: 'ROLE_ADMIN', // Administrador
  user: 'ROLE_USER', 
  producer: 'ROLE_PRODUCER', // Fabricante de Baterías
  vehicle_manufacturer: 'ROLE_MANUFACTURER', // Fabricante de Vehículos
  distributor: 'ROLE_DISTRIBUTOR', // Distribuidor / Concesionario
  owner: 'ROLE_OWNER',  // Usuario Final
  recycler: 'ROLE_RECYCLER', // Reciclador / Reutilizador 
  transporter: 'ROLE_TRANSPORTER', // El encargado de movilizar las baterias entre producer, vehicle_manufacturer, 
    // Hay una entidad shipment en la que se ejecutara cada vez que ejecutemos algo aqui 
📌 Actores del Sistema
1️⃣ Productor (Fabricante de Baterías)
Registra cada batería con un identificador único (ID de batería).
Incluye metadatos: capacidad, materiales usados, certificaciones de seguridad, etc.
Solo puede transferir baterías a fabricantes de coches o distribuidores.
2️⃣ Fabricante de Vehículos
Recibe baterías del productor.
Instala las baterías en coches eléctricos y registra la vinculación con el vehículo.
Solo puede transferir el coche con batería a concesionarios o distribuidores.
3️⃣ Distribuidor / Concesionario
Recibe los vehículos con sus baterías registradas.
Vende vehículos a clientes finales o flotas de empresas.
Solo puede transferir el coche con batería a consumidores.
4️⃣ Propietario del Vehículo (Usuario Final)
Puede verificar la trazabilidad de la batería.
Cuando la batería alcanza el final de su vida útil, puede enviarla a reciclaje o reutilización.
Puede transferir la batería a recicladores o a otra empresa de reutilización.
5️⃣ Reciclador / Reutilizador
Recibe baterías usadas.
Procesa baterías para extracción de materiales o reutilización en otras aplicaciones (almacenamiento energético, por ejemplo).
Puede registrar la conversión de la batería en otros activos o eliminar su registro si se destruye.
⚙️ Funcionalidades Clave
1️⃣ Gestión de Identidad
✅ Cada actor tiene una identidad única con certificados X.509.
✅ Control de acceso basado en roles mediante políticas de endorsement.

2️⃣ Registro de Activos
🔋 Baterías:

Cada batería tiene un registro único con metadatos: capacidad, voltaje, fecha de fabricación, ID de celdas, etc.
Registro de cambios en el estado de la batería (uso, carga/descarga, salud, etc.).
🔄 Reciclaje o Reutilización:

Registro de baterías que se han reciclado o reutilizado.
Seguimiento de materiales extraídos para trazabilidad de la economía circular.
3️⃣ Sistema de Transferencias
🔗 Trazabilidad de la propiedad:

Transferencias controladas según los roles: productor → fabricante → distribuidor → usuario → reciclador.
Validación mediante endorsement policies.
Registro de cambios de estado de la batería (uso, reparación, degradación).
4️⃣ Visualización de la Trazabilidad
👁️ Historial completo de la batería:

Visualización de toda la cadena de custodia.
Consultas para verificar la procedencia y estado actual.
🛠️ Arquitectura Técnica
1️⃣ Frontend - Plataforma Web
📌 Framework: Next.js
📌 Características:

Dashboard por rol (Fabricante, Distribuidor, Usuario, Reciclador).
Integración con Fabric SDK para interactuar con la blockchain.
2️⃣ Chaincode (Smart Contracts en Hyperledger Fabric)
📝 Funcionalidades:

Registro de baterías y metadatos.
Transferencia de propiedad según roles.
Registro del estado de salud de la batería.
Registro de reciclaje o reutilización.
3️⃣ Red Blockchain (Hyperledger Fabric)
🌐 Configuración de Red

Organizaciones: Productores, Fabricantes, Distribuidores, Usuarios, Recicladores.
Canales: Diferentes canales para compartir información relevante entre actores.
Fabric CA para autenticación y gestión de certificados.
🚀 Despliegue
✅ Red Fabric

Uso de Fabric Samples para despliegue inicial.
Configuración de organizaciones y canales.
Hyperledger Explorer para monitoreo.
✅ Frontend

Hospedado en Vercel.
Configuración de dominios y certificados SSL/TLS.
