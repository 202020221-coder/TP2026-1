// import { useState, useEffect } from "react";
// import { GetAllProducts, GetAllServices } from "../api/request.api";
// import type { GetProductDTO, GetServiceDTO } from "../interfaces/read-service-producs.dto";

// export const useDataFetching = () => {
//   const [products, setProducts] = useState<GetProductDTO[]>();
//   const [services, setServices] = useState<GetServiceDTO[]>();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [productsResponse, servicesResponse] = await Promise.all([
//           GetAllProducts(1, 10),
//           GetAllServices(1, 10),
//         ]);

//         // Correcto: Acceder a la propiedad 'data' de la respuesta
//         setProducts(productsResponse.data);
//         setServices(servicesResponse.data);
        
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : "Error al cargar los datos";
//         setError(errorMessage);
//         console.error("Detalle del error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []); 

//   return { products, services, loading, error };
// };