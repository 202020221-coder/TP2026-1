import type { IRoute } from "@/shared/interfaces/route";
import { LoginPage } from "../pages";
// 🔹 Se definen todas las rutas publicas del modulo de autenticacion
export const routes: IRoute[] = [
  {
    path: "/login",
    Component: LoginPage,
  },
];