import { Route, Routes } from "react-router";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
import { NotFoundPage } from "@/shared/pages";
import { CreateRequestPage } from "../orders/pages/create-request/CreateRequestPage";

import { routes } from "./routes";
import { IntranetLayout } from "../layout/IntranetLayout";
import { RolesRecord } from "@/security/session/enum/roles.enum";
export const IntranetNavigation = () => {
  return (
    <Routes>
      <Route element={<IntranetLayout className="px-4" />}>
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
      </Route>
      <Route
        path="/solicitudes/crear"
        element={
          <PrivateRoute roles={[RolesRecord.client]}>
            <CreateRequestPage />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default IntranetNavigation;
