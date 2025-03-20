import axios from "axios";
import { UserRegisterDTO } from "../entity/dto/user-auth.dto";
import { User } from "../entity/user.entity";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RegisterResponse {
  message: string;
  user: User;
}

export const registerUserService = async (userRegisterData: UserRegisterDTO): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register`, userRegisterData);

    return response.data;
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    throw new Error("No se pudo registrar el usuario");
  }
};
