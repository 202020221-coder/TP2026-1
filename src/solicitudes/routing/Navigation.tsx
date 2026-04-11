import { Route, Routes } from "react-router";
import { routes } from "./routes";
import { NotFoundPage } from "@/shared/pages";
import { PrivateRoute } from "@/shared/routing";

export const OrdersNavigation = () => {
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default OrdersNavigation;
