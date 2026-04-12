import { Navigate, Route, Routes } from "react-router";
import { routes } from "./routes";
import { PrivateRoute } from "@/shared/routing";

export const HomeNavigation = () => {
  return (
    <Routes>
      {routes.map(({ path, Component, ...rest }) => (
        <Route
          key={path}
          path={path}
          element={
            // <ExtranetLayout>
            rest.isPrivate ? (
              <PrivateRoute roles={rest.roles}>
                <Component />
              </PrivateRoute>
            ) : (
              <Component />
            )
            // </ExtranetLayout>
          }
        />
      ))}
      {/* Redirección para rutas inválidas bajo /extranet/** */}
      <Route path="*" element={<Navigate replace to="/welcome" />} />
    </Routes>
  );
};

export default HomeNavigation;
