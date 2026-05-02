import { useQuotationConditionStore } from "../../hooks/stores/quotation.conditions.store.provider";
import { ConditionSectionView } from "./ConditionSectionView";
export const ConditionSection = () => {
  const update = useQuotationConditionStore((s) => s.update);
  const conditions = useQuotationConditionStore((s) => s.conditions);
  const emissionDate = useQuotationConditionStore((s) => s.emissionDate);
  const expirationDate = useQuotationConditionStore((s) => s.expirationDate);
  return (
    <ConditionSectionView
      conditions={conditions}
      emissionDate={emissionDate}
      expirationDate={expirationDate}
      onConditionsChange={(val) => update("conditions", val)}
      onEmissionChange={(val) => update("emissionDate", val)}
      onExpirationChange={(val) => update("expirationDate", val)}
    />
  );
};
