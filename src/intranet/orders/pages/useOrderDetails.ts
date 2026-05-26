import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { getOrder } from "../api";
import type { GetOrderResponseDTO } from "../interfaces";
import type { DetailedOrder } from "../interfaces/order";

export const useOrderDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const orderId = Number(params["orderId"]);
  const idValid = !Number.isNaN(orderId);
  const orderDetailsQuery = useQuery({
    queryKey: ["order", "details", orderId],
    queryFn: async () => {
      const response = await getOrder(orderId);
      const result = adaptDTO(response);
      return result;
    },
    enabled: idValid,
  });

  return {
    orderDetailsQuery,
    navigate,
    idValid,
  };
};

const adaptDTO = (DTO: GetOrderResponseDTO):DetailedOrder => {
  //algoritmo de adaptacion
  return DTO;
}; 