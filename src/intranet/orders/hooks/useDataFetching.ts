import { useState, useEffect } from "react";
import { GetAllProducts } from "../api/order.api";
import type { GetProductDTO } from "../interfaces/read-service-producs.dto";

export const useDataFetching = () => {
  const [products, setProducts] = useState<GetProductDTO[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsResponse = await GetAllProducts(1, 10);
        setProducts(productsResponse.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error al cargar los datos";
        setError(errorMessage);
        console.error("Detalle del error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { products, loading, error };
};