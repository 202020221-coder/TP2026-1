import { getAvailableTrucks } from "@/intranet/quotation/api/order.api";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useTruckSelector = () => {
  const [page, setPage] = useState(1);

  const trucksQuery = useQuery({
    queryKey: ["trucks", page],
    queryFn: () => getAvailableTrucks({ page, limit: 3 }),
  });

  return { trucksQuery, setPage };
};
