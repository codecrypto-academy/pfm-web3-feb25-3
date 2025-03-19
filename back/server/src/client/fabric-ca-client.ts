import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import { User, ICryptoSuite, Utils, ICryptoKey, IKeyValueStore } from 'fabric-common';
import * as path from 'path';
import * as fs from 'fs/promises';

// Ruta de la wallet donde se almacenan las identidades
const walletPath = path.resolve(__dirname, '../../wallet');
const orgBasePath = path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/peerOrganizations');
const caBasePath = path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/fabric-ca');

/*
El término enroll en Fabric CA se refiere al proceso de inscripción de un usuario en la autoridad certificadora (CA) para obtener su certificado digital (cert.pem).
Este certificado es lo que le permite autenticarse en la red de Hyperledger Fabric.
*/
export class FabricCAClient {

  private async getFabricCA(mspId: string): Promise<FabricCAServices> {
    let caUrl, tlsCertPath, caName;

    if (mspId === 'Org1MSP') {
        caUrl = 'https://localhost:7054';
        tlsCertPath = path.resolve(caBasePath, 'org1', 'tls-cert.pem');
        caName = 'ca-org1'; // Agrega el nombre de la CA
    } else {
        caUrl = 'https://localhost:8054';
        tlsCertPath = path.resolve(caBasePath, 'org2', 'tls-cert.pem');
        caName = 'ca-org2'; // Agrega el nombre de la CA
    }

    // Leer el certificado TLS
    const tlsCert = await fs.readFile(tlsCertPath, 'utf8');

    // Configurar opciones TLS para la conexión con Fabric CA
    const caOptions = {
        trustedRoots: [tlsCert],
        verify: false, // Cambiar a true si quieres validación estricta de certificados
    };

    return new FabricCAServices(caUrl, caOptions, caName); // ✅ Agregar nombre de CA
}


	/**
		* Obtiene la identidad del administrador como un objeto `User` válido para Fabric CA.
		*/
		private async getAdminIdentity(mspId: string): Promise<User> {
			const wallet = await Wallets.newFileSystemWallet(walletPath);
			const adminLabel = `admin-${mspId}`;

			// 📌 Intentar obtener el admin desde la wallet
			let identity = await wallet.get(adminLabel) as X509Identity;
			if (!identity) {
				console.log(`⚠️ No se encontró la identidad del administrador en la wallet. Buscando en organizations...`);

				// 📌 **Importar admin desde `organizations/peerOrganizations/.../users/`**
				const orgName = mspId === 'Org1MSP' ? 'org1.example.com' : 'org2.example.com';
				const adminPath = path.join(orgBasePath, orgName, 'users', `Admin@${orgName}`, 'msp');
				const certPath = path.join(adminPath, 'signcerts', `cert.pem`);
				const keyDir = path.join(adminPath, 'keystore');

				// 📌 **Leer certificado y clave privada del administrador**
				const certificate = await fs.readFile(certPath, 'utf8');
				const keyFiles = await fs.readdir(keyDir);
				if (keyFiles.length === 0) {
					throw new Error(`❌ No se encontró clave privada en ${keyDir}`);
				}
				const privateKeyPEM = await fs.readFile(path.join(keyDir, keyFiles[0]), 'utf8');

				// 📌 **Crear identidad X.509 para la wallet**
				const adminIdentity: X509Identity = {
					credentials: { certificate, privateKey: privateKeyPEM },
					mspId: mspId,
					type: 'X.509',
				};

				// 📌 **Guardar la identidad en la wallet para futuros usos**
				await wallet.put(adminLabel, adminIdentity);
				console.log(`✅ Admin ${adminLabel} importado y guardado en la wallet`);

				identity = adminIdentity;
			} else {
				console.log(`✅ Admin ${adminLabel} encontrado en la wallet`);
			}

			// 📌 **Configurar `CryptoSuite` correctamente**
			const cryptoSuite: ICryptoSuite = Utils.newCryptoSuite();
			const cryptoKeyStore = Utils.newCryptoKeyStore();
			cryptoSuite.setCryptoKeyStore(cryptoKeyStore);

			// 🔥 ✅ **Ahora `importKey()` funcionará sin errores**
			const privateKey = await cryptoSuite.importKey(identity.credentials.privateKey);

			// 📌 **Crear objeto `User` válido**
			const adminUser = new User(adminLabel);
			await adminUser.setEnrollment(privateKey, identity.credentials.certificate, mspId);
			adminUser.setCryptoSuite(cryptoSuite);

			console.log(`✅ Admin ${adminLabel} listo para usar en Fabric CA`);
			return adminUser;
		}




	async registerUser(ethereumAddress: string, role: string, mspId: string): Promise<X509Identity> {
		const ca = await this.getFabricCA(mspId);
		const wallet = await Wallets.newFileSystemWallet(walletPath);
		const adminIdentity = await this.loginWithUserIDAndPassword('admin', 'adminpw', mspId);

		console.log(`Registrando usuario ${ethereumAddress} con rol ${role} en ${mspId}`);

		// Verificar si el usuario ya existe en la wallet
		const userIdentity = await wallet.get(ethereumAddress);
		if (userIdentity) {
			console.log(`Usuario ${ethereumAddress} ya existe en la wallet`);
			return userIdentity as X509Identity;
		}

		const provider = ca.newIdentityService();
		try {
			await provider.getOne(ethereumAddress, adminIdentity);
			console.log(`Usuario ${ethereumAddress} ya existe en Fabric CA`);
			return userIdentity as X509Identity;
		} catch (error) {
			console.log(`Usuario no encontrado en CA, se procederá al registro.`);
		}

		// ✅ 🔥 Corrección: Ahora `adminIdentity` es un `User` válido para Fabric CA
		const secret = await ca.register(
			{
				enrollmentID: ethereumAddress,
				role: 'client',
				affiliation: '', // Importante dejarlo vacío si no usas afiliaciones
				attrs: [
					{ name: 'role', value: role, ecert: true },
					{ name: 'ethAddress', value: ethereumAddress, ecert: true },
				],
			},
			adminIdentity // ✅ Ahora adminIdentity es un `User`, no una `X509Identity`
		);

		// Enrolar el usuario y obtener sus credenciales
		const enrollment = await ca.enroll({
			enrollmentID: ethereumAddress,
			enrollmentSecret: secret,
		});

		// Crear y almacenar la identidad en la wallet
		const newUserIdentity: X509Identity = {
			credentials: {
				certificate: enrollment.certificate,
				privateKey: enrollment.key.toBytes(),
			},
			mspId: mspId,
			type: 'X.509',
		};

		await wallet.put(ethereumAddress, newUserIdentity);
		console.log(`Usuario ${ethereumAddress} registrado y enrolado con éxito en ${mspId}`);
		return newUserIdentity;
	}



  async loginWithUserIDAndPassword(userID: string, password: string, mspId: string): Promise<User> {
    const ca = await this.getFabricCA(mspId);
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // 🔍 Intentar inscribir directamente al usuario con userID y password
    try {
        const enrollment = await ca.enroll({
            enrollmentID: userID,
            enrollmentSecret: password, // Se usa la contraseña para obtener certificado
        });

        // ✅ Si el usuario se inscribe con éxito, guardar la identidad en la wallet
        const newUserIdentity: X509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: mspId,
            type: 'X.509',
        };

        await wallet.put(userID, newUserIdentity);
        console.log(`✅ Usuario ${userID} inscrito con éxito y almacenado en la wallet`);

        // 🔥 Convertir la identidad en un objeto `User`
        return this.getUser(newUserIdentity);
    } catch (error) {
        console.error(`❌ Error en login: El usuario no está registrado o la contraseña es incorrecta`);
        throw new Error('Credenciales inválidas o usuario no registrado');
    }
}


  async getUser(identity: X509Identity): Promise<User> {
    const cryptoSuite: ICryptoSuite = Utils.newCryptoSuite();
    const cryptoKeyStore = Utils.newCryptoKeyStore();
    cryptoSuite.setCryptoKeyStore(cryptoKeyStore);

    const privateKey = await cryptoSuite.importKey(identity.credentials.privateKey);
    const user = new User(identity.mspId);
    await user.setEnrollment(privateKey, identity.credentials.certificate, identity.mspId);
    user.setCryptoSuite(cryptoSuite);

    console.log(`✅ Usuario ${identity.mspId} obtenido correctamente como User`);
    return user;
}
}
