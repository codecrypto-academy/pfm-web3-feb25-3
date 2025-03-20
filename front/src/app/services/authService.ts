import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AuthResponse {
  id_token: string;
}

export const authenticateUser = async (ethereumAddress: string, signature: string, nonce: string) => {
  const response = await axios.post<AuthResponse>(`${API_URL}/authenticate`, {
    ethereumAddress,
    signature,
    nonce
  });
 
  return response.data.id_token;
};

export const getAuthenticatedUser = async () => {
  const response = await axios.get(`${API_URL}/account`);
  return response.data;
  
};
