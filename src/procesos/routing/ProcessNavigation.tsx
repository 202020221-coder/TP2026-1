import { Route, Routes } from "react-router";
import { PrivateRoute } from "@/shared/routing/PrivateRoute";
import { NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";

export const ProcessNavigation = () => {
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

export default ProcessNavigation;
