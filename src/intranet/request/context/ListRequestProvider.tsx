// import { useState, type FC, type ReactNode } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { ListRequestContext } from "./ListRequestContext";
// import { GetAllRequest } from "../api/request.api";
// import type { GetRequestQP } from "../interfaces";

// export const ListRequestsProvider: FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [queryParams, setQueryParams] = useState<GetRequestQP>({
//     page: 1,
//   });
//   const result = useQuery({
//     queryKey: ["requests", queryParams],
//     queryFn: () => GetAllRequest(),
//   });
//   const query = (queryParams: GetRequestQP) => {
//     setQueryParams(queryParams);
//   };
//   //trayendo categorias
//   return (
//     // <ListRequestContext.Provider value={{ result, query, queryParams }}>
//     //   {children}
//     // </ListRequestContext.Provider>
//     <>
//     </>
//   );
// };
