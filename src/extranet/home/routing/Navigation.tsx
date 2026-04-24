import { Navigate, Route, Routes } from "react-router";
import { routes } from "./routes";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default HomeNavigation;
