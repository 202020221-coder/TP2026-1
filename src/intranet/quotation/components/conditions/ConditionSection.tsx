import { useConditionStore } from "../../hooks/stores/conditions.store.provider";
import { ConditionSectionView } from "./ConditionSectionView";
export const ConditionSection = () => {
  const update = useConditionStore((s) => s.update);
  const conditions = useConditionStore((s) => s.conditions);
  const emissionDate = useConditionStore((s) => s.emissionDate);
  const expirationDate = useConditionStore((s) => s.expirationDate);
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
