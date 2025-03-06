# 🚗🔋 Plataforma de Trazabilidad de Baterías de Coches Eléctricos

## 📌 Descripción
Este repositorio contiene la **Plataforma de Trazabilidad de Baterías de Coches Eléctricos**, un sistema descentralizado basado en **Hyperledger Fabric** que permite rastrear el ciclo de vida de las baterías desde su producción hasta su reciclaje.

## 🎯 Objetivo
Garantizar la autenticidad, sostenibilidad y cumplimiento normativo en la gestión de baterías de vehículos eléctricos mediante blockchain.

---

## 📂 Estructura del Proyecto

```
.
├── front/        # Frontend en Next.js
│   ├── pages/
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── README.md
│   └── .env.local
│
├── back/         # Backend en Node.js con Hyperledger Fabric SDK
│   ├── src/
│   ├── controllers/
│   ├── routes/
│   ├── README.md
│   └── .env
│
└── blockchain/   # Configuración de Hyperledger Fabric
    ├── chaincode/
    ├── network/
    └── organizations/
```

---

## 🚀 Tecnologías Utilizadas

- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, Hyperledger Fabric SDK
- **Blockchain:** Hyperledger Fabric
- **Base de datos:** CouchDB (para Fabric World State)
- **Autenticación:** Fabric CA con certificados X.509
- **Despliegue:** Vercel (Frontend) y Docker (Backend)

---

## 📌 Funcionalidades Principales

### 🔋 Gestión de Baterías
- Registro de baterías con metadatos (capacidad, voltaje, fecha de fabricación, etc.).
- Seguimiento del estado de salud y cambios de propiedad.
- Registro de baterías recicladas o reutilizadas.

### 🔗 Transferencias y Trazabilidad
- Control de propiedad de las baterías mediante smart contracts.
- Validación de transacciones con endorsement policies.
- Historial completo de la batería con consultas avanzadas.

---

## 🏗️ Instalación y Configuración

### 🔧 Requisitos Previos
- Node.js 18+
- Yarn o npm
- Docker (para backend y blockchain)
- Hyperledger Fabric configurado y en ejecución

### 📦 Instalación del Proyecto

#### 1️⃣ Clonar el repositorio
```sh
git clone https://github.com/tu-repo/trazabilidad-baterias.git
cd trazabilidad-baterias
```

#### 2️⃣ Configurar e iniciar el backend
```sh
cd back
yarn install  # o npm install
yarn dev
```
El backend estará disponible en `http://localhost:3001`.

#### 3️⃣ Configurar e iniciar el frontend
```sh
cd ../front
yarn install  # o npm install
yarn dev
```
El frontend estará disponible en `http://localhost:3000`.

---

## 🚀 Despliegue

### 🔹 Backend (Docker)
```sh
docker build -t backend-trazabilidad ./back
docker run -p 3001:3001 --env-file ./back/.env backend-trazabilidad
```

### 🔹 Frontend (Vercel)
1. Conectar el repositorio con Vercel.
2. Configurar variables de entorno.
3. Desplegar automáticamente con cada push a `main`.

---

## 🛠️ Contribución
1. Hacer un fork del repositorio.
2. Crear una nueva rama (`feature/nueva-funcionalidad`).
3. Hacer commit de los cambios (`git commit -m 'Añadir nueva funcionalidad'`).
4. Enviar un Pull Request.

---

## 📄 Licencia
Este proyecto está bajo la licencia **MIT**.

---

## 📞 Contacto
Si tienes dudas o sugerencias, puedes escribir a: [email@example.com](mailto:email@example.com).