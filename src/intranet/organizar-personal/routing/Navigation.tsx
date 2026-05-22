import { lazy } from "react";
import { Route, Routes } from "react-router";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
import { NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";

const ProjectPickerPage = lazy(
  () => import("../pages/ProjectPickerPage"),
);

export const OrganizarPersonalNavigation = () => {
  return (
    <Routes>
      <Route
        index
        element={
          <PrivateRoute>
            <ProjectPickerPage />
          </PrivateRoute>
        }
      />
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

export default OrganizarPersonalNavigation;
