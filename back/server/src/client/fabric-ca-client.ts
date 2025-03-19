import FabricCAServices from 'fabric-ca-client';
import { Wallets, X509Identity } from 'fabric-network';
import { User, ICryptoSuite, Utils } from 'fabric-common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { UserDTO } from 'src/service/dto/user.dto';
import { RegisterUserDTO } from 'src/service/dto/user-register.dto';

// Constantes globales
const WALLET_PATH = path.resolve(__dirname, '../../wallet');
const ORG_BASE_PATH = path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/peerOrganizations');
const CA_BASE_PATH = path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/fabric-ca');
const CA_CONFIG = {
    Org1MSP: { url: 'https://localhost:7054', tlsPath: 'org1/tls-cert.pem', name: 'ca-org1' },
    Org2MSP: { url: 'https://localhost:8054', tlsPath: 'org2/tls-cert.pem', name: 'ca-org2' },
};

// 
export class FabricCAClient {

    private async getFabricCA(mspId: string): Promise<FabricCAServices> {
        const caInfo = CA_CONFIG[mspId];
        if (!caInfo) throw new Error(`MSP ID ${mspId} no soportado`);
        
        const tlsCertPath = path.resolve(CA_BASE_PATH, caInfo.tlsPath);
        const tlsCert = await fs.readFile(tlsCertPath, 'utf8');
        
        return new FabricCAServices(caInfo.url, { trustedRoots: [tlsCert], verify: false }, caInfo.name);
    }

    async fabricClientLoginUser(user: UserDTO): Promise<boolean> {
      const { ethereumAddress} = user;
      const mspId = this.getMSPIdFromRole(user.roles[0]);

      const ca = await this.getFabricCA(mspId);
      const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

      // Verificar si el usuario está en la wallet
      const existingIdentity = await wallet.get(ethereumAddress);
      if (existingIdentity) {
          console.log(`✅ Usuario ${ethereumAddress} encontrado en la wallet`);
          return true;
      }

      try {
          await ca.newIdentityService().getOne(ethereumAddress, await this.getAdminIdentity(mspId));
          console.log(`✅ Usuario ${ethereumAddress} existe en Fabric CA pero no en la wallet`);
          return true;
      } catch {
          console.log(`❌ Usuario ${ethereumAddress} no encontrado en Fabric CA`);
          return false;
      }
  }


    private async getAdminIdentity(mspId: string): Promise<User> {
        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
        const adminLabel = `admin-${mspId}`;
        let identity = await wallet.get(adminLabel) as X509Identity;

        if (!identity) {
            console.log(`⚠️ No se encontró la identidad del administrador en la wallet. Importando...`);
            
            const orgName = mspId === 'Org1MSP' ? 'org1.example.com' : 'org2.example.com';
            const adminPath = path.join(ORG_BASE_PATH, orgName, 'users', `Admin@${orgName}`, 'msp');
            
            const certificate = await fs.readFile(path.join(adminPath, 'signcerts', 'cert.pem'), 'utf8');
            const keyFiles = await fs.readdir(path.join(adminPath, 'keystore'));
            if (!keyFiles.length) throw new Error(`❌ No se encontró clave privada en ${adminPath}/keystore`);
            const privateKeyPEM = await fs.readFile(path.join(adminPath, 'keystore', keyFiles[0]), 'utf8');
            
            identity = { credentials: { certificate, privateKey: privateKeyPEM }, mspId, type: 'X.509' };
            await wallet.put(adminLabel, identity);
        }

        return this.createUserFromIdentity(adminLabel, identity);
    }

    async registerUser(user: RegisterUserDTO): Promise<X509Identity> {
        const { ethereumAddress} = user;
        const role = user.roles[0];
        const mspId = this.getMSPIdFromRole(role);
        const ca = await this.getFabricCA(mspId);
        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
        const adminIdentity = await this.loginWithUserIDAndPassword('admin', 'adminpw', mspId);

        if (await wallet.get(ethereumAddress)) {
            console.log(`Usuario ${ethereumAddress} ya existe en la wallet`);
            return await wallet.get(ethereumAddress) as X509Identity;
        }

        try {
            await ca.newIdentityService().getOne(ethereumAddress, adminIdentity);
            console.log(`Usuario ${ethereumAddress} ya existe en Fabric CA`);
            return await wallet.get(ethereumAddress) as X509Identity;
        } catch {
            console.log(`Usuario no encontrado en CA, procediendo al registro.`);
        }

        const secret = await ca.register({
            enrollmentID: ethereumAddress,
            role: 'client',
            affiliation: '',
            attrs: [
                { name: 'role', value: role, ecert: true },
                { name: 'ethAddress', value: ethereumAddress, ecert: true },
            ],
        }, adminIdentity);

        return this.enrollAndStoreUser(ca, ethereumAddress, secret, mspId);
    }

    async loginWithUserIDAndPassword(userID: string, password: string, mspId: string): Promise<User> {
        const ca = await this.getFabricCA(mspId);
        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

        try {
            const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: password });
            const identity: X509Identity = {
                credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
                mspId,
                type: 'X.509',
            };
            await wallet.put(userID, identity);
            return this.createUserFromIdentity(userID, identity);
        } catch {
            throw new Error('Credenciales inválidas o usuario no registrado');
        }
    }

    private async createUserFromIdentity(label: string, identity: X509Identity): Promise<User> {
        const cryptoSuite: ICryptoSuite = Utils.newCryptoSuite();
        cryptoSuite.setCryptoKeyStore(Utils.newCryptoKeyStore());
        const privateKey = await cryptoSuite.importKey(identity.credentials.privateKey);
        const user = new User(label);
        await user.setEnrollment(privateKey, identity.credentials.certificate, identity.mspId);
        user.setCryptoSuite(cryptoSuite);
        return user;
    }

    private async enrollAndStoreUser(ca: FabricCAServices, userID: string, secret: string, mspId: string): Promise<X509Identity> {
        const enrollment = await ca.enroll({ enrollmentID: userID, enrollmentSecret: secret });
        const identity: X509Identity = {
            credentials: { certificate: enrollment.certificate, privateKey: enrollment.key.toBytes() },
            mspId,
            type: 'X.509',
        };
        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);
        await wallet.put(userID, identity);
        return identity;
    }

    private getMSPIdFromRole(role: string): string {
        switch (role) {
            case 'ROLE_PRODUCER':
                return 'Org1MSP';
            case 'ROLE_DISTRIBUTOR':
                return 'Org2MSP';
            case 'ROLE_TRANSPORT':
                return 'Org2MSP';
            case 'ROLE_OWNER':
                return 'Org2MSP';
            default:
                throw new Error(`Rol ${role} no soportado`);
        }
    }
    
}
