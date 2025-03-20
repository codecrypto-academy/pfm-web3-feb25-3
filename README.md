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


# Desarrollo
$$
## Estructura de Carpetas

La estructura de carpetas del proyecto debe ser la siguiente:

```
/project-root/
  ├── fabric-samples/  # Repositorio de Hyperledger Fabric
  ├── back/      # Backend
  ├── chaincode/      # Chaincodes
  ├── front/      # Frontend
```

Es importante que el directorio `fabric-samples` esté en la raíz del proyecto para garantizar el correcto funcionamiento de los scripts de red.


## Levantar la Red
# 🚀 Configuración y despliegue de la red Hyperledger Fabric

Este documento describe cómo iniciar y desplegar un contrato inteligente en una red de Hyperledger Fabric utilizando el script `network.sh`.

## 📌 Prerrequisitos
Antes de ejecutar estos comandos, asegúrate de tener instalados los siguientes componentes:

- [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/latest/install.html)
- Docker y Docker Compose
- Node.js y npm (para contratos en TypeScript)

## 🛠️ Pasos para levantar la red y desplegar el contrato
Ejecuta el siguiente comando para limpiar, iniciar la red y desplegar el contrato inteligente:

```bash
./network.sh down && \
./network.sh up createChannel -ca -c mychannel && \
./network.sh deployCCAAS -ccn basicts -ccp ../asset-transfer-basic/chaincode-typescript
```

### 🔍 Explicación de los comandos:
1. `./network.sh down` → Detiene y elimina cualquier red activa.
2. `./network.sh up createChannel -ca -c mychannel` → Levanta la red, crea el canal `mychannel` y usa una Autoridad de Certificación (`-ca`).
3. `./network.sh deployCCAAS -ccn basicts -ccp ../asset-transfer-basic/chaincode-typescript` → Despliega el contrato inteligente `basicts` ubicado en `../asset-transfer-basic/chaincode-typescript`.

## 🌍 Configuración del entorno
Para interactuar con la red desde `test-network`, define las siguientes variables de entorno:

```bash
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=$PWD/../config/
export CORE_PEER_TLS_ENABLED=true
export CORE_PEER_LOCALMSPID="Org1MSP"
export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
export CORE_PEER_ADDRESS=localhost:7051
```

### 🔍 Explicación de las variables:
- `PATH` y `FABRIC_CFG_PATH`: Configuran las rutas para Fabric.
- `CORE_PEER_TLS_ENABLED`: Habilita la comunicación segura TLS.
- `CORE_PEER_LOCALMSPID`: Identifica la organización (`Org1MSP`).
- `CORE_PEER_TLS_ROOTCERT_FILE`: Especifica el certificado TLS del peer.
- `CORE_PEER_MSPCONFIGPATH`: Ruta de las credenciales del administrador.
- `CORE_PEER_ADDRESS`: Dirección del peer con el que interactuar.

## ✅ Verificación del despliegue
Para asegurarte de que el contrato inteligente ha sido desplegado correctamente, puedes ejecutar:

```bash
peer chaincode query -C mychannel -n basicts -c '{"Args":["ping"]}'
---

Si necesitas más detalles sobre la configuración de Hyperledger Fabric, revisa la documentación oficial en [Hyperledger Fabric Docs](https://hyperledger-fabric.readthedocs.io/).

 Development Chaincode As A service

 // Explicar que hay que modificar el deployCCAA.sh para establecer una url predefinida en el connection.json de los peer, para que nosotros en un proyecto a parte podamos levantar nuestro chaincode as a service. En esa url y con el chaincodeId, que usemos, el chaincode id lo usamos cuanod deplsgeamos un chaincode n la red 
```
+ docker run --rm -d --name peer0org1_basicts_ccaas --network fabric_test -e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 -e CHAINCODE_ID=basicts_1.0:8371cec9c422e3223145adfcd0e6b4e6a1cf5199c32e97eb31865ece571439c2 -e CORE_CHAINCODE_ID_NAME=basicts_1.0:8371cec9c422e3223145adfcd0e6b4e6a1cf5199c32e97eb31865ece571439c2 basicts_ccaas_image:latest
0539c88fe45641b2fe1fba525f19cb541b2b6558ae1d8cffa8b43f8c9e3f3914
+ docker run --rm -d --name peer0org2_basicts_ccaas --network fabric_test -e CHAINCODE_SERVER_ADDRESS=0.0.0.0:9999 -e CHAINCODE_ID=basicts_1.0:8371cec9c422e3223145adfcd0e6b4e6a1cf5199c32e97eb31865ece571439c2 -e CORE_CHAINCODE_ID_NAME=basicts_1.0:8371cec9c422e3223145adfcd0e6b4e6a1cf5199c32e97eb31865ece571439c2 basicts_ccaas_image:latest
ac6d4c343a473c831d1ee1371f5ce674af809d4a2941c96e1d3990e52cb9d834