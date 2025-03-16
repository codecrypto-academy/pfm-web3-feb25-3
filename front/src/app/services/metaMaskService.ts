import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

/**
 * Verifica si MetaMask está instalado y disponible.
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== "undefined" && !!window.ethereum;
};

/**
 * Conecta MetaMask y obtiene la dirección Ethereum del usuario.
 */
export const connectMetaMask = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    alert("Por favor, instala MetaMask");
    return null;
  }

  try {
    const accounts = await window.ethereum!.request({ method: "eth_requestAccounts" });
    return accounts[0] || null;
  } catch (error) {
    console.error("Error al conectar con MetaMask:", error);
    return null;
  }
};

/**
 * Genera un nonce aleatorio para firmar.
 */
export const generateNonce = (): string => {
  return Math.floor(Math.random() * 1000000).toString();
};

/**
 * Firma un mensaje con MetaMask.
 */
export const signMessage = async (message: string): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    alert("MetaMask no está instalado");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum!);
    const signer = await provider.getSigner();
    return await signer.signMessage(message);
  } catch (error) {
    console.error("Error al firmar el mensaje:", error);
    return null;
  }
};

/**
 * Obtiene los datos del usuario desde MetaMask (dirección + firma).
 */
export const getMetaMaskUserData = async (): Promise<{ ethereumAddress: string; signature: string; nonce: string } | null> => {
  const ethereumAddress = await connectMetaMask();
  if (!ethereumAddress) return null;

  const nonce = generateNonce();
  const message = `Signing in to CarBatteryTraceability. Nonce: ${nonce}`;
  const signature = await signMessage(message);

  if (!signature) return null;

  return { ethereumAddress, signature, nonce };
};
