import { Route, Routes } from "react-router";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
import { NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";

export const ProjectsNavigation = () => {
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

      {/* Ruta de error 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ProjectsNavigation;
