import { memo, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoadingPage, NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import { IntranetLayout } from "../layout/IntranetLayout";
export const Navigation = memo(() => {
  const groupedRoutes = routes.reduce(
    (acc, route) => {
      const key = route.isPrivate ? "private" : "public";
      if (!acc[key]) acc[key] = [];
      acc[key].push(route);
      return acc;
    },
    {} as Record<string, typeof routes>,
  );
  const { private: privateRoutes, public: publicRoutes } = groupedRoutes;
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route element={<IntranetLayout className="bg-amber-400" />}>
            {privateRoutes.map(({ path, Component }) => (
              <Route key={path} path={path} element={<Component />} />
            ))}
          </Route>
          {publicRoutes.map(({ path, Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          <Route path="/intranet/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/intranet/*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
});
