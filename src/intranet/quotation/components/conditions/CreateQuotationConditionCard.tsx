import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";
import { ConditionCard } from "./ConditionCard";
export const CreateQuotationConditionCard = () => {
  const update = useQuotationConditionStore((s) => s.update);
  const conditions = useQuotationConditionStore((s) => s.conditions);
  const emissionDate = useQuotationConditionStore((s) => s.emissionDate);
  const expirationDate = useQuotationConditionStore((s) => s.expirationDate);
  return (
    <ConditionCard
      conditions={conditions}
      emissionDate={emissionDate}
      expirationDate={expirationDate}
      onConditionsChange={(val) => update("conditions", val)}
      onEmissionChange={(val) => update("emissionDate", val)}
      onExpirationChange={(val) => update("expirationDate", val)}
    />
  );
};
