import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { LoadingPage, NotFoundPage } from "@/shared/pages";
import { routes } from "./routes";
import UnauthorizedPage from "../pages/UnauthorizedPage";
export const Navigation = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage/>}>
        <Routes>
          {
            routes.map(({path, Component}) => (
              <Route key={path} path={path} element={<Component/>}/>
            ))
          }
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage/>} />

        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}