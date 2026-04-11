// import { type JSX } from "react";
// import { NotFoundPage } from "../pages";
// import LoginPage from "@/auth/pages/page";

// type JSXComponent = () => JSX.Element;

// export interface RouteConfig {
//   path: string;
//   Component: React.LazyExoticComponent<JSXComponent> | JSXComponent;
//   label?: string;
// }

// export const PUBLIC_ROUTES: RouteConfig[] = [
//   { path: "/auth/login", Component: LoginPage, label: "Login" },
// ];

// export const PRIVATE_ROUTES: RouteConfig[] = [
//   /**CLIENTE */
//   // { path: "/solicitudes/crear-solicitud", Component: ()=>{}, label: "Crear Solicitud" },
//   // {path:"/solicitudes/mis-solicitudes", Component: ()=>{}, label: "Mis Solicitudes"},
//   // {path:"/cotizaciones/mis-cotizaciones", Component: ()=>{}, label: "Mis Cotizaciones"},
//   // {path:"/cotizaciones/ver-cotizacion", Component: ()=>{}, label: "Cotizacion - Detalles"},

//   /**ADMIN */
//   // {path:"/solicitudes/gestionar-solicitudes", Component: ()=>{}, label: "Gestión de Solicitudes"},


// ];

// export const ERROR_ROUTES: RouteConfig[] = [
//   { path: "*", Component: NotFoundPage, label: "NotFoundPage" },
// ];
// export const ALL_ROUTES = [
//   ...PUBLIC_ROUTES,
//   ...PRIVATE_ROUTES,
//   ...ERROR_ROUTES,
// ];
