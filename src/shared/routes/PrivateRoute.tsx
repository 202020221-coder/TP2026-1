import type { JSX } from 'react';
import { Navigate } from 'react-router';

// import { useAuthStore } from '@/shared/store/AuthStore';
// import { isValidatedJwt } from "@/shared/lib/jwt-decode";

interface PrivateRouteProps {
  children: JSX.Element
  roles?: string[] // opcional, por si quieres proteger por rol
}

export function PrivateRoute ({ children, roles }: PrivateRouteProps) {
  // const user = useAuthStore(state => state.user);
  // const access_token = useAuthStore(state => state.access_token);

  // if(isValidatedJwt(access_token)) {
  //   useAuthStore().clearSession();
  //   return <Navigate to='/login' replace />
  // }

  // if (!user) return <Navigate to='/auth/login' replace />

  // if (roles && !roles.includes(user.role)) return <Navigate to='/unauthorized' replace />

  return children
}