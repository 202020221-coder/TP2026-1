import { useSession, clearSession } from "@/profile/hooks/stores/useSession.store";
import type { JSX } from "react";
import { Navigate } from "react-router";
import { isValidatedJwt } from "@/shared/lib/jwt-decode";
import type { UserRole } from "@/profile/interfaces/roles";

interface PrivateRouteProps {
  children: JSX.Element;
  roles?: UserRole[]; // opcional, por si quieres proteger por rol
}

//HOC Pattern
export function PrivateRoute({ children, roles }: PrivateRouteProps) {
  //using selectors of what we need from the Session Store
  const userInfo = useSession((state) => state.loggedUser);
  const accessToken = useSession((state) => state.accessToken);
  if (!isValidatedJwt(accessToken)) {
    clearSession();
    return <Navigate to="/auth/login" replace />;
  }

  if (!userInfo) return <Navigate to="/auth/login" replace />;

  if (roles && !roles.includes(userInfo.role))
    return <Navigate to="/unauthorized" replace />;

  return children;
}
