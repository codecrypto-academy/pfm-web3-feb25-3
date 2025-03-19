import { Logger } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Wallets, X509Identity } from 'fabric-network';
import { UserDTO } from 'src/service/dto/user.dto';

const CA_CONFIG = {
    Org1MSP: { url: 'localhost:7051', host: 'peer0.org1.example.com' }, // Peer de Org1
    Org2MSP: { url: 'localhost:9051', host: 'peer0.org2.example.com' }, // Peer de Org2
};

const TLS_CERT_PATHS = {
    Org1MSP: path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem'),
    Org2MSP: path.resolve(__dirname, '../../../../fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem'),
};

export class FabricChaincodeClient {
    private gateway: ReturnType<typeof connect>;
    private client: grpc.Client;
    private contract: Contract;
    private readonly logger = new Logger(FabricChaincodeClient.name);

    constructor(private readonly chaincode: string, private readonly channel: string) {}

    /**
     * Obtener el MSP ID según el rol del usuario
     */
    private getMSPIdFromRole(role: string): string {
        switch (role) {
            case 'ROLE_PRODUCER':
                return 'Org1MSP';  // Conectar a Org1
            case 'ROLE_DISTRIBUTOR':
            case 'ROLE_TRANSPORT':
            case 'ROLE_OWNER':
                return 'Org2MSP';  // Conectar a Org2
            default:
                throw new Error(`Rol ${role} no soportado`);
        }
    }

    /**
     * Enviar una transacción al ledger
     */
    async submitTransaction(user: UserDTO, contractName: string, transactionName: string, ...args: string[]): Promise<void> {
        await this.init(user, contractName);
        this.logger.log(`Enviando transacción: ${transactionName}`);
        await this.contract.submitTransaction(transactionName, ...args);
        this.logger.log('Transacción confirmada exitosamente');
        this.close();
    }

    /**
     * Evaluar una transacción (consulta)
     */
    async evaluateTransaction(user: UserDTO, contractName: string, transactionName: string, ...args: string[]): Promise<any> {
        await this.init(user, contractName);
        this.logger.log(`Evaluando transacción: ${transactionName}`);
        const resultBytes = await this.contract.evaluateTransaction(transactionName, ...args);
        this.close();
        return JSON.parse(new TextDecoder().decode(resultBytes));
    }

    /**
     * Crear conexión gRPC segura con el peer según el MSP ID
     */
    private async newGrpcConnection(mspId: string): Promise<grpc.Client> {
        this.logger.log('Creando conexión gRPC segura');
        const tlsRootCert = await fs.readFile(TLS_CERT_PATHS[mspId]);
        const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
        const peerEndpoint = CA_CONFIG[mspId].url;
        return new grpc.Client(peerEndpoint, tlsCredentials, {
            'grpc.ssl_target_name_override': CA_CONFIG[mspId].host,
        });
    }

    /**
     * Obtener la identidad del usuario desde la wallet
     */
    private async getUserIdentity(user: UserDTO): Promise<{ identity: Identity; privateKey: string }> {
        this.logger.log(`Obteniendo identidad de ${user} desde la wallet`);
        const wallet = await Wallets.newFileSystemWallet(path.resolve(__dirname, '../../wallet'));
        const identity = await wallet.get(user.ethereumAddress) as X509Identity;
        if (!identity) {
            throw new Error(`Identidad de usuario ${user.ethereumAddress} no encontrada en la wallet`);
        }

        const identityGateway: Identity = {
            mspId: identity.mspId,
            credentials: Buffer.from(identity.credentials.certificate),
        };
        return { identity: identityGateway, privateKey: identity.credentials.privateKey };
    }

    /**
     * Cargar el firmante desde la clave privada del usuario
     */
    private async newSigner(privateKeyPem: string): Promise<Signer> {
        this.logger.log('Cargando firmante desde la clave privada del usuario');
        const privateKey = crypto.createPrivateKey(privateKeyPem);
        return signers.newPrivateKeySigner(privateKey);
    }

    /**
     * Inicializa la conexión con Fabric usando la identidad del usuario autenticado
     */
    async init(user: UserDTO, contractName: string): Promise<void> {
        this.logger.log(`Inicializando conexión con Fabric para el usuario ${user.ethereumAddress}`);
        
        const mspId = this.getMSPIdFromRole(user.roles[0]); // Obtener el MSP basado en el rol del usuario
        this.client = await this.newGrpcConnection(mspId);

        const { identity, privateKey } = await this.getUserIdentity(user);
        const signer = await this.newSigner(privateKey);

        this.gateway = connect({
            client: this.client,
            identity,
            signer,
            hash: hash.sha256,
            evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
            endorseOptions: () => ({ deadline: Date.now() + 15000 }),
            submitOptions: () => ({ deadline: Date.now() + 5000 }),
            commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
        });

        const network = this.gateway.getNetwork(this.channel);
        this.contract = network.getContract(this.chaincode, contractName);
        this.logger.log(`Conexión establecida con Fabric para usuario ${user.ethereumAddress}`);
    }

    /**
     * Cierra la conexión con Fabric
     */
    private close(): void {
        this.logger.log('Cerrando conexión con Fabric');
        this.gateway.close();
        this.client.close();
    }
}
