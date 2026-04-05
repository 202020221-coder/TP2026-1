import { type JSX } from "react";
import { NotFoundPage } from "../pages";

type JSXComponent = () => JSX.Element;

export interface RouteConfig {
  path: string;
  Component: React.LazyExoticComponent<JSXComponent> | JSXComponent;
  label?: string;
}

export const PUBLIC_ROUTES: RouteConfig[] = [
  // Rutas Publicas
  // Ejemplo: { path: "/login",
  //  Component: LoginPage,
  //  label: "Login" }
];

export const PRIVATE_ROUTES: RouteConfig[] = [
  // Rutas privadas , que requieren autenticacion
  // Ejemplo: { path: "/intranet/dashboard",
  //  Component: DashboardPage,
  //  label: "Dashboard" }
];

export const ERROR_ROUTES: RouteConfig[] = [
  {path: "*", Component: NotFoundPage , label:"NotFoundPage"}
];
export const ALL_ROUTES = [...PUBLIC_ROUTES, ...PRIVATE_ROUTES, ...ERROR_ROUTES];
