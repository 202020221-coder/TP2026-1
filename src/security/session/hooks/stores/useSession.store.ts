import { RolesRecord } from "../../enum/roles.enum";
import type { User } from "../../interfaces/user";
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
    },
  ),
);

// Actions outside - they work the same way
export const clearSession = () => {
  useSession.setState({ loggedUser: null, accessToken: null });
};

export const createSession = (email: string) => {
  const isClient = email === "cliente@gmail.com";
  useSession.setState({
    loggedUser: {
      correo: email,
      rol: isClient ? RolesRecord.client : RolesRecord.projectAdmin,
      idusuario: 99999,
      dni_perfil: "12345678",
    },
    accessToken: "token-de-acceso",
  });
};
