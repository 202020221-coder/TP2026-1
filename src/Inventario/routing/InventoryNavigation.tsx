import { Route, Routes } from "react-router";
import { PrivateRoute } from "@/shared/routing/PrivateRoute";
import { NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";

export const InventoryNavigation = () => {
  return (
    <Routes>
      {routes.map(({ path, Component, roles }) => (
        <Route
          key={path}
          path={path}
          element={
            <PrivateRoute roles={roles}>
              <Component />
            </PrivateRoute>
          }
        />
      ))}

      {/* Ruta de error 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default InventoryNavigation;
