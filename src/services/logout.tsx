// src/services/logout.tsx
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router";

export const useLogout = () => {
  const { setCurrentUser, setToken } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // 1. Elimina el token de localStorage
      localStorage.removeItem("token");

      // 2. Limpia el estado en tu contexto
      setToken(null);
      setCurrentUser(null);

      // 3. (Opcional) Redirige al login o a la página que desees
      navigate("/login");
    } catch (error) {
      console.error("Error al hacer logout:", error);
    }
  };

  return { handleLogout };
};
