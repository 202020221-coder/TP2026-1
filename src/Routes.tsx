// src/Routes.ts
import { createBrowserRouter, RouterProvider } from "react-router";
import Welcome from "./home/pages/Welcome";
import { NotFoundPage } from "./shared/pages";
import { lazy, type JSX } from "react";

type JSXComponent = () => JSX.Element;

export interface IRoute {
    path: string;
    Component: React.LazyExoticComponent<JSXComponent> | JSXComponent;
}

export interface IPrivateRoute extends IRoute { roles?: string[]; }

const DirectoryNavigation = lazy(() => import('@/directorio/routes/DirectoryNavigation'));
const ProcessNavigation = lazy(() => import('@/procesos/routes/ProcessNavigation'));
const InventoryNavigation = lazy(() => import('@/Inventario/routes/InventoryNavigation'));

const Router = createBrowserRouter([
    {
        children: [
            {
                path: "/",
                Component: Welcome,
            },
            {
                path: "/directorio/*",
                Component: DirectoryNavigation,
            },
            {
                path: "/procesos/*",
                Component: ProcessNavigation,
            },
            {
                path: "/inventario/*",
                Component: InventoryNavigation,
            },
            {
                path: "*",
                Component: NotFoundPage,
            },
        ],
    },

]);

export function Navigation() {
    return <RouterProvider router={Router} />;
}

export default Router;