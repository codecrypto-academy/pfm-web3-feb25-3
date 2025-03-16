import axios from "axios";
import { UserRegisterDTO } from "../entity/dto/user-auth.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterResponse {
  message: string;
}

export const registerUser = async (userRegisterData: UserRegisterDTO) => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, userRegisterData);

    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw new Error("No se pudo registrar el usuario");
  }
};
