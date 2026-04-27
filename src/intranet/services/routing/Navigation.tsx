import { Route, Routes } from "react-router";
import { routes } from "./routes";
import { NotFoundPage } from "@/shared/pages";
import { PrivateRoute } from "@/security/routing/PrivateRoute";

export const ServicesNavigation = () => {
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

export default ServicesNavigation;
