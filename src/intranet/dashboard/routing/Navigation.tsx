import { Route, Routes } from "react-router";
import { NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
export const DashboardNavigation = () => {
  return (
    <Routes>
      {routes.map(({ path, Component, ...rest }) => (
        <Route
          key={path}
          path={path}
          element={
            rest.isPrivate ? (
              <PrivateRoute roles={rest.roles}>
                <Component />
              </PrivateRoute>
            ) : (
              <Component />
            )
          }
        />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default DashboardNavigation;
