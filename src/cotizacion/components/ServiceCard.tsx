// import type { FC } from "react";
// import {
//   Card,
//   CardDescription,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/shared/components/ui/card";
// import { Input } from "@/shared/components/ui/input";
// import { CircleAlertIcon } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import { getClient } from "../api/client.api";
// export const ServiceCard: FC<{ serviceId: string }> = ({ serviceId }) => {
//   const { isPending, error, data } = useQuery({
//     queryKey: ["client", serviceId],
//     queryFn: () => getClient(serviceId),
//   });
//   return (
//     <Card className={`shadow-none h-[85%] sm:flex sm:h-auto`}>
//       <CardHeader>
//         <CardTitle className="flex flex-row items-end gap-x-1.5 mx-auto sm:mx-0">
//           <CircleAlertIcon />
//           <span className="pb-0.5 font-[375]">Servicio {serviceId}</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="flex flex-col sm:grid sm:grid-cols-2 gap-1.5 overflow-y-auto">
//         {/*==========DIRECCION========*/}
//         <Card className="shadow-none border-orange-400 bg-orange-100 sm:col-span-2">
//           <CardHeader>
//             <CardTitle className="text-orange-400 flex justify-between items-center">
//               Dirección de recojo de muestras
//               {data?.requiere_recojo && (
//                 <span className="rounded-full px-3 py-1 text-[14px] font-medium border bg-white text-orange-400 border-orange-400 text-center">
//                   Recojo Requerido
//                 </span>
//               )}
//             </CardTitle>
//             <CardDescription>
//               <p>
//                 <span className="font-bold">Dirección: </span>
//                 <span className="italic">{data?.proyecto.ubicacion}</span>
//               </p>
//               <p>
//                 <span className="font-bold">Horario: </span>
//                 <span className="italic">8am-5pm</span>
//               </p>
//             </CardDescription>
//           </CardHeader>
//         </Card>
//         {/*=========OBSERVACIONES=====*/}
//         <Card className="shadow-none border-gray-400 bg-gray-50">
//           <CardHeader>
//             <CardTitle className="text-gray-700">
//               Observaciones del cliente
//             </CardTitle>
//             <CardDescription className="text-gray-600 overflow-y-auto">
//               {data?.observaciones}
//             </CardDescription>
//           </CardHeader>
//         </Card>
//         <Card className="shadow-none border-amber-400 bg-amber-50">
//           <CardHeader>
//             <CardTitle className="text-amber-700">
//               Otros ensayos solicitados
//             </CardTitle>
//             <CardDescription className="text-gray-600 overflow-y-auto">
//               {isLoading || isPending ? (
//                 <p>Cargando...</p>
//               ) : isError ? (
//                 <p className="text-destructive">Error: {error.message}</p>
//               ) : (
//                 data.ensayos
//                   .filter((at) => at)
//                   .map((rt, i: number) => (
//                     <div key={i} className="py-1.5 flex flex-col gap-y-1.5">
//                       <p className="font-bold">{rt.nombre_ensayo}</p>
//                       <p className="font-light">{"No se que poner"}</p>
//                     </div>
//                   ))
//               )}
//             </CardDescription>
//           </CardHeader>
//         </Card>
//       </CardContent>
//     </Card>
//   );
// };
