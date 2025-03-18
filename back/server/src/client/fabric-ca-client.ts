import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import { User, ICryptoSuite, Utils } from 'fabric-common';
import * as path from 'path';

// Ruta de la wallet donde se almacenan las identidades
const walletPath = path.resolve(__dirname, '../../wallet');

export class FabricCAClient {
    private async getFabricCA(mspId: string): Promise<FabricCAServices> {
        const caUrl = mspId === 'Org1MSP' ? 'http://localhost:7054' : 'http://localhost:8054';
        return new FabricCAServices(caUrl);
    }

    private async getAdminIdentity(mspId: string): Promise<User> {
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const identity = await wallet.get(`admin-${mspId}`) as X509Identity;
        if (!identity) {
            throw new Error(`No se encontró la identidad del administrador para ${mspId}`);
        }

        // Crear objeto User compatible con Fabric CA
        const cryptoSuite: ICryptoSuite = Utils.newCryptoSuite();
        const adminUser = new User(`admin-${mspId}`);
        await adminUser.setEnrollment(null, identity.credentials.certificate, mspId);
        adminUser.setCryptoSuite(cryptoSuite);

        return adminUser;
    }

    async registerUser(ethereumAddress: string, role: string, mspId: string): Promise<X509Identity> {
        const ca = await this.getFabricCA(mspId);
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        const adminIdentity = await this.getAdminIdentity(mspId);

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
        await ca.register(
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
            enrollmentSecret: ethereumAddress,
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
}
