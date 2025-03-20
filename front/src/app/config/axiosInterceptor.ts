import axios from 'axios';
import { useRouter } from 'next/router'; // Para redirigir al login en caso de un error
import { useAuthContext } from '@/app/context/AuthContext'; // Para llamar a la función logout si es necesario

const setupAxiosInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      // Intentamos obtener el token JWT del localStorage
      const token = localStorage.getItem('jwt');
      if (token) {
        // Si existe el token, lo añadimos a las cabeceras
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      // Si hay un error en la solicitud, lo rechazamos
      return Promise.reject(error);
    }
  );

  // Interceptor de respuesta para manejar errores 401
  axios.interceptors.response.use(
    (response) => response, // Si la respuesta es exitosa, la pasamos
    async (error) => {
      if (error.response && error.response.status === 401) {
        // Si hay un error 401 (no autorizado), significa que el token ha expirado o es inválido
        const router = useRouter();
        const { logout } = useAuthContext(); // Usamos el contexto de autenticación

        // Aquí puedes agregar más lógica para manejar el redireccionamiento
        logout(); // Esto elimina el token y realiza la acción de cierre de sesión

        // Redirigimos al usuario al login
        router.push('/login');

        // Retornamos el error para que sea manejado por cualquier otro lugar si es necesario
        return Promise.reject(error);
      }
      return Promise.reject(error); // Si no es un error 401, lo pasamos como está
    }
  );
};

export default setupAxiosInterceptor;
