import { Navigate, Route, Routes } from "react-router";
import { routes } from "./routes";

export const HomeNavigation = () => {
  return (
    <Routes>
      {routes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={
            // <ExtranetLayout>
            <Component />
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
