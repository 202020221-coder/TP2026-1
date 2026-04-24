import { memo, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoadingPage, NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";
import { PrivateRoute } from "@/security/routing/PrivateRoute";
export const Navigation = memo(() => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
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
          {/* <Route path="/intranet/unauthorized" element={<UnauthorizedPage />} /> */}
          <Route path="/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
});
