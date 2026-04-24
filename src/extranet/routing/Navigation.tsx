import { Route, Routes } from "react-router";
import { routes } from "./routes";
import { NotFoundPage } from "@/shared/pages";

export const ExtranetNavigation = () => {
  return (
    <Routes>
      {routes.map(({path, Component}) => (
        <Route
          key={path}
          path={path}
          element={<Component/>
          }
        />
      ))}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default ExtranetNavigation;
