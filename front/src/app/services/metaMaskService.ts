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

export const getMetaMaskUserData = async (): Promise<{ ethereumAddress: string[]; signature: string; nonce: string } | null> => {
	const ethereumAddress = await connectMetaMask();
	if (!ethereumAddress) return null;

	const nonce = generateNonce();
	const message = `Signing in to CarBatteryTraceability. Nonce: ${nonce}`;
	const signature = await signMessage(message);

	if (!signature) return null;

	return { ethereumAddress, signature, nonce };
};

/**
	* Conecta MetaMask y obtiene todas las direcciones Ethereum disponibles.
	*/
/**
 * Conecta MetaMask y permite al usuario seleccionar una cuenta manualmente.
 */
export const connectMetaMask = async (): Promise<string[] | null> => {
	if (!window.ethereum) {
	  alert("Por favor, instala MetaMask");
	  return null;
	}
  
	try {
	  // Solicita permiso para ver las cuentas y seleccionar manualmente
	  await window.ethereum.request({
		method: "wallet_requestPermissions",
		params: [{ eth_accounts: {} }],
	  });
  
	  // Ahora, solicita las cuentas disponibles
	  const accounts: string[] = await window.ethereum.request({
		method: "eth_requestAccounts",
	  }) as string[];
  
	  if (!accounts || accounts.length === 0) {
		alert("No tienes cuentas disponibles en MetaMask.");
		return null;
	  }
  
	  return accounts;
	} catch (error) {
	  console.error("Error al conectar con MetaMask:", error);
	  return null;
	}
  };
  
