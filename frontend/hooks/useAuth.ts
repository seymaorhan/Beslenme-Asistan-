import { useState, useEffect } from "react";
import { getStoredUser, logout } from "../services/authService";

export type User = { id: string; name: string; email: string };

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStoredUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const signOut = async () => {
    await logout();
    setUser(null);
  };

  return { user, loading, signOut, setUser };
};
