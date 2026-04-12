import type { IRoute } from "@/shared/interfaces/route";
import {
  GestionarInventario,
  GestionarCamiones,
  InventarioCamiones,
} from "../pages";
// 🔹 Se definen todas las rutas privadas del módulo de Inventario
export const routes: IRoute[] = [
  {
    path: "/",
    Component: GestionarInventario,
    roles: ["CLIENT"],
    isPrivate: true,
  },
  {
    path: "camiones",
    Component: InventarioCamiones,
    roles: ["ADMIN"],
    isPrivate: true,
  },
  {
    path: "gestionar-camiones",
    Component: GestionarCamiones,
    roles: ["ADMIN"],
    isPrivate: true,
  },
];
