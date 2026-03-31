import { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";

import { routes } from "./routes";

import { LoadingPage, NotFoundPage } from "@/shared/pages";

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
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}