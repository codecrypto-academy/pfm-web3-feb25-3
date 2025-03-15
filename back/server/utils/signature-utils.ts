import { ethers } from 'ethers';

/**
 * Compara si la firma es válida para la dirección Ethereum dada.
 */

export async function compareSignature(
  nonce: string, // Recibir el nonce desde el frontend
  signature: string,
  ethereumAddress: string
): Promise<boolean> {
  try {
    // Construir el mismo mensaje con el nonce que se firmó en el frontend
    const message = `Nonce: ${nonce}`;
    
    // Verificar la firma con ethers.js
    const signerAddress = ethers.verifyMessage(message, signature);

    // Verificar que la dirección firmante sea la misma
    return signerAddress.toLowerCase() === ethereumAddress.toLowerCase();
  } catch (error) {
    console.error("Error validando firma:", error);
    return false; // Si hay un error, la firma es inválida
  }
}

