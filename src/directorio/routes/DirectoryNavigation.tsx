// import { Route, Routes } from 'react-router';
// import { PrivateRoute } from '@/shared/routes/PrivateRoute';

// // import { ValidRoles } from '@/shared/interfaces';


// import { NotFoundPage } from '@/shared/pages';
// import { GestionarPersonal } from '../pages';
// import type { IPrivateRoute } from '@/Routes';

// const routes: IPrivateRoute[] = [
//     {
//         path: '/',
//         Component: GestionarPersonal,
//         roles: []
//     },
// ]

// export const DirectoryNavigation = () => {
//     return (
//         <Routes>
//             {
//                 routes.map(({ path, Component, roles }) => (
//                     <Route
//                         key={path}
//                         path={path}
//                         element={
//                             <PrivateRoute roles={roles}>
//                                 <Component />
//                             </PrivateRoute>
//                         }
//                     />
//                 ))
//             }
//             <Route path="*" element={<NotFoundPage />} />
//         </Routes>
//     )
// }

// export default DirectoryNavigation
