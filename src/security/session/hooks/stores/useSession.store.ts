import type { LogInResponse } from "@/extranet/auth/interfaces/responses.dto";
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

export const createSession = ({ user, token }: LogInResponse) => {
  useSession.setState({
    loggedUser: {
      correo: user.correo,
      rol: user.rol,
      idusuario: user.idusuario,
      dni_perfil: user.dni_perfil,
    },
    accessToken: token,
  });
};
