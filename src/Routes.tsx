// src/Routes.ts
import { createBrowserRouter, redirect, RouterProvider } from "react-router";
import Welcome from "./home/pages/Welcome";
import { GestionarPersonal, Menu } from "./procesos/pages";
import { GestionarCamiones, GestionarInventario, InventarioCamiones } from "./Inventario/pages";


// import AppLayout from "@src/Layout";
const Router = createBrowserRouter([
    {
        children: [
            {
                path: "/",
                Component: Welcome,
            },
            {
                path: "/administracion",
                Component: GestionarPersonal,
            },
            {
                path: "/procesos",
                Component: Menu,
            },
            {
                path: "/Inventario",
                Component: GestionarInventario,
            },
            {
                path: "/inventario/camiones",
                Component: InventarioCamiones,
            },
            {
                path: "/inventario/gestionar-camiones",
                Component: GestionarCamiones,
            },
        ],
    },

]);

export function Navigation() {
    return <RouterProvider router={Router} />;
}

export default Router;