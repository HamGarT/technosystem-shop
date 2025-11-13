import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// Interceptor para errores globales
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response?.status === 401) {
//             // Token expirado o inválido
//             localStorage.removeItem("authToken");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// );
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken'); // o de donde guardes el token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;