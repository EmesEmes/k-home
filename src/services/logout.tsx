import { useUser } from "@/context/UserContext";
import { supabase } from "@/utils/supabaseClient";

export const useLogout = () => {
  const { setCurrentUser, setUserProfile } = useUser();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return { handleLogout };
};