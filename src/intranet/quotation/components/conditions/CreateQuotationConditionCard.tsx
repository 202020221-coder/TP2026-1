import { useEffect } from "react";
import { format, parseISO, subDays } from "date-fns";
import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";
import { useQuotationReferenceStore } from "../../hooks/stores/quotation.reference.store.provider";
import { ConditionCard } from "./ConditionCard";

export const CreateQuotationConditionCard = () => {
  const update = useQuotationConditionStore((s) => s.update);
  const conditions = useQuotationConditionStore((s) => s.conditions);
  const observaciones = useQuotationConditionStore((s) => s.observations);
  const emissionDate = useQuotationConditionStore((s) => s.emissionDate);
  const expirationDate = useQuotationConditionStore((s) => s.expirationDate);
  const projectStartDate = useQuotationReferenceStore(
    (s) => s.projectStartDate,
  );

  // La vigencia de la cotización termina el día anterior al inicio del proyecto.
  // (Si el proyecto inicia el 15/06, la vigencia vence el 14/06.)
  useEffect(() => {
    if (!projectStartDate) return;
    const start = parseISO(projectStartDate);
    if (Number.isNaN(start.getTime())) return;
    const computed = format(subDays(start, 1), "yyyy-MM-dd");
    if (computed !== expirationDate) {
      update("expirationDate", computed);
    }
  }, [projectStartDate, expirationDate, update]);

  return (
    <ConditionCard
      conditions={conditions}
      observaciones={observaciones}
      emissionDate={emissionDate}
      expirationDate={expirationDate}
      expirationDisabled
      expirationHint="Se calcula automáticamente: un día antes del inicio del proyecto."
      onConditionsChange={(val) => update("conditions", val)}
      onObservacionesChange={(val) => update("observations", val)}
      onEmissionChange={(val) => update("emissionDate", val)}
      onExpirationChange={(val) => update("expirationDate", val)}
    />
  );
};
