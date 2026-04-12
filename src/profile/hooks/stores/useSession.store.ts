import type { User } from "@/profile/interfaces/user";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SessionStore = {
  loggedUser: User | null;
  accessToken: string | null;
};

export const useSession = create<SessionStore>()(
  persist(
    (_set) => ({
      loggedUser: null,
      accessToken: null,
    }),
    {
      name: "user-session", // key name in localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Actions outside - they work the same way
export const clearSession = () => {
  alert("LIMPIANDO SESION");
  useSession.setState({ loggedUser: null, accessToken: null });
};

export const createSession = (email:string) => {
  alert("CREANDO SESION");
  const isClient = email==="cliente@gmail.com"
  useSession.setState({
    loggedUser: {
      email: "usuario@example.com",
      role: isClient?"CLIENT":"ADMIN",
      username: isClient?"cliente":"administrador",
    },
    accessToken: "token-de-acceso",
  });
};