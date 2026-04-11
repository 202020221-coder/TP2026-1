import type { IPrivateRoute } from '@/shared/interfaces/route';
import { GestionarPersonal } from '../pages';

export const routes: IPrivateRoute[] = [
    {
        path: '/',
        Component: GestionarPersonal,
        roles: ["ADMIN"]
    },
]