import { Logger } from '@nestjs/common';
import * as grpc from '@grpc/grpc-js';
import { connect, Contract, hash, Identity, Signer, signers } from '@hyperledger/fabric-gateway';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { TextDecoder } from 'util';

/**
	* Configuración global
	*/
const utf8Decoder = new TextDecoder();
const channelName = process.env.CHANNEL_NAME || 'mychannel';
const chaincodeName = process.env.CHAINCODE_NAME || 'basic';
const mspId = process.env.MSP_ID || 'Org1MSP';

// Directorios de certificados
const cryptoPath = path.resolve(__dirname, '..', '..', '..', '..', "pfm-traza-hlf-2025", "fabric-samples", 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com');
const keyDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');
const certDirectoryPath = path.resolve(cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts');
const tlsCertPath = path.resolve(cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');
const peerEndpoint = process.env.PEER_ENDPOINT || 'localhost:7051';
const peerHostAlias = process.env.PEER_HOST_ALIAS || 'peer0.org1.example.com';

/**
	* Clase FabricClient para manejar conexiones y transacciones con Fabric Gateway
	*/
export class FabricClient {
	private gateway: ReturnType<typeof connect>;
	private client: grpc.Client;
	private contract: Contract;
	private readonly logger = new Logger(FabricClient.name);

	constructor(private readonly chaincode: string, private readonly channel: string) {}

	/**
		* Inicializa la conexión con Hyperledger Fabric
	*/
	async init(): Promise<void> {
		this.logger.log('Inicializando conexión con Fabric');
		this.client = await this.newGrpcConnection();
		this.gateway = connect({
			client: this.client,
			identity: await this.newIdentity(),
			signer: await this.newSigner(),
			hash: hash.sha256,
			evaluateOptions: () => ({ deadline: Date.now() + 5000 }),
			endorseOptions: () => ({ deadline: Date.now() + 15000 }),
			submitOptions: () => ({ deadline: Date.now() + 5000 }),
			commitStatusOptions: () => ({ deadline: Date.now() + 60000 }),
		});

		const network = this.gateway.getNetwork(this.channel);
		this.contract = network.getContract(this.chaincode);
		this.logger.log('Conexión establecida con Fabric');
	}

	/**
		* Cierra la conexión con Fabric
		*/
	close(): void {
		this.logger.log('Cerrando conexión con Fabric');
		this.gateway.close();
		this.client.close();
	}

	/**
		* Enviar una transacción al ledger
		*/
	async submitTransaction(transactionName: string, ...args: string[]): Promise<void> {
		this.logger.log(`Enviando transacción: ${transactionName}`);
		await this.contract.submitTransaction(transactionName, ...args);
		this.logger.log('Transacción confirmada exitosamente');
	}

	/**
		* Evaluar una transacción (consulta)
		*/
	async evaluateTransaction(transactionName: string, ...args: string[]): Promise<any> {
		this.logger.log(`Evaluando transacción: ${transactionName}`);
		const resultBytes = await this.contract.evaluateTransaction(transactionName, ...args);
		return JSON.parse(utf8Decoder.decode(resultBytes));
	}

	/**
		* Crear conexión gRPC segura con el peer
		*/
	private async newGrpcConnection(): Promise<grpc.Client> {
		this.logger.log('Creando conexión gRPC segura');
		const tlsRootCert = await fs.readFile(tlsCertPath);
		const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
		return new grpc.Client(peerEndpoint, tlsCredentials, {
			'grpc.ssl_target_name_override': peerHostAlias,
		});
	}

	/**
		* Cargar la identidad del usuario desde el certificado
		*/
	private async newIdentity(): Promise<Identity> {
		this.logger.log('Cargando identidad del usuario');
		const certPath = await this.getFirstDirFile(certDirectoryPath);
		const credentials = await fs.readFile(certPath);
		return { mspId, credentials };
	}

	/**
		* Cargar el firmante desde la clave privada del usuario
		*/
	private async newSigner(): Promise<Signer> {
		this.logger.log('Cargando firmante del usuario');
		const keyPath = await this.getFirstDirFile(keyDirectoryPath);
		const privateKeyPem = await fs.readFile(keyPath);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
		return signers.newPrivateKeySigner(privateKey);
	}

	/**
		* Obtener el primer archivo de un directorio
		*/
	private async getFirstDirFile(dirPath: string): Promise<string> {
		const files = await fs.readdir(dirPath);
		if (files.length === 0) throw new Error(`No files in directory: ${dirPath}`);
		return path.join(dirPath, files[0]);
	}
}