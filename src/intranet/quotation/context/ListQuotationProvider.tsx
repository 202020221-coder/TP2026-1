import { useEffect, useState, type FC, type ReactNode } from "react";
import type { GetQuotationQP } from "../interfaces/query-params.dto";
import { useQuery } from "@tanstack/react-query";
import { getAllQuotations } from "../api/quotation.api";
import { ListQuotationContext } from "./ListQuotationContext";
import { useSession } from "@/security/session/hooks/stores/useSession.store";

export const ListQuotationsProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const user = useSession((state) => state.loggedUser);
  const [queryParams, setQueryParams] = useState<GetQuotationQP>({
    page: 1,
    per_page: 10,
  });

  useEffect(() => {
    if (!user?.dni_perfil) return;

    setQueryParams((currentQueryParams) => ({
      ...currentQueryParams,
      dni_o_ruc: user.dni_perfil,
    }));
  }, [user?.dni_perfil]);

  const result = useQuery({
    queryKey: ["quotations", queryParams],
    queryFn: () => getAllQuotations(queryParams),
  });
  useEffect(() => {
    console.debug("ListQuotationsProvider: queryParams ->", queryParams);
  }, [queryParams]);

  useEffect(() => {
    if (result.data) {
      console.debug("ListQuotationsProvider: response ->", result.data);
    }
  }, [result.data]);
  const query = (queryParams: GetQuotationQP) => {
    setQueryParams(queryParams);
  };

  return (
    <ListQuotationContext.Provider value={{ result, query, queryParams }}>
      {children}
    </ListQuotationContext.Provider>
  );
};
