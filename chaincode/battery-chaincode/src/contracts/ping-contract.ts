import { Context, Contract, Info, Returns, Transaction } from 'fabric-contract-api';

@Info({ title: 'PingContract', description: 'Contrato para verificar conectividad' })
export class PingContract extends Contract {
    
    @Transaction()
    @Returns('string')
    public async ping(ctx: Context): Promise<string> {
        // Obtener la identidad del usuario
        const clientIdentity = ctx.clientIdentity;
        
        // Extraer atributos o roles
        const attributes = clientIdentity.getAttributeValue('role') || 'No role assigned';

        // Crear respuesta como JSON
        const response = {
            message: "Pong",
            role: attributes
        };

        return JSON.stringify(response); // Devuelve la respuesta en formato JSON
    }
} 