import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

export function ProjectAssistantQuotationDetailsPage() {
  const params = useParams();
  const quotationId = Number(params["quotationId"]);

//   const quotationQuery = useQuery()
  return <h1>pepe el grillo {quotationId}</h1>;
}
