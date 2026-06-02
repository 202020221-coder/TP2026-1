import { useSession } from "../session/hooks/stores/useSession.store";
import type { JSX } from "react";
import { Navigate, useLocation } from "react-router";
import { isValidatedJwt } from "@/shared/lib/jwt-decode";
import type { UserRole } from "../session/interfaces/roles";

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: UserRole[]; // opcional, por si quieres proteger por rol
}

//HOC Pattern
export function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const location = useLocation();
  //using selectors of what we need from the Session Store
  const userInfo = useSession((state) => state.loggedUser);
  const accessToken = useSession((state) => state.accessToken);
  if (!isValidatedJwt(accessToken)) {
    return <Navigate to="/auth/login" state={{ from: location.pathname + location.search }} replace />;
  }

  if (!userInfo) return <Navigate to="/auth/login" state={{ from: location.pathname + location.search }} replace />;

  if (roles && !roles.includes(userInfo.rol))
    return <Navigate to="/intranet/unauthorized" replace />;

  return children;
}
