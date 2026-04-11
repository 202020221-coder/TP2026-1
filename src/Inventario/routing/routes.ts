import type { IPrivateRoute } from "@/shared/interfaces/route";
import { GestionarInventario, GestionarCamiones, InventarioCamiones } from "../pages";
// 🔹 Se definen todas las rutas privadas del módulo de Inventario
export const routes: IPrivateRoute[] = [
  {
    path: "/",
    Component: GestionarInventario,
    roles: ["CLIENT"],
  },
  {
    path: "camiones",
    Component: InventarioCamiones,
    roles: ["ADMIN"],
  },
  {
    path: "gestionar-camiones",
    Component: GestionarCamiones,
    roles: ["ADMIN"],
  },
];