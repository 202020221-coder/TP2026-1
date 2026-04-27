import { useOrderConditions } from "@/intranet/quotation/hooks/stores/conditions.store";
import { ConditionSectionView } from "./ConditionSectionView";
export const ConditionSection = () => {
  const update = useOrderConditions((s) => s.update);
  const conditions = useOrderConditions((s) => s.conditions);
  const emissionDate = useOrderConditions((s) => s.emissionDate);
  const expirationDate = useOrderConditions((s) => s.expirationDate);
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
