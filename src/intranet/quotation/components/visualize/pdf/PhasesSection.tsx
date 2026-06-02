import { Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  section: {
    marginVertical: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 6,
  },
  phaseRow: {
    marginBottom: 6,
    paddingLeft: 4,
  },
  phaseName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  phaseMeta: {
    fontSize: 9,
    marginBottom: 2,
    color: "#333",
  },
  phaseDesc: {
    fontSize: 9,
    marginBottom: 2,
    color: "#555",
  },
  activityList: {
    paddingLeft: 8,
  },
  activityItem: {
    fontSize: 9,
    marginBottom: 1,
  },
  emptyText: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#888",
  },
});

interface PhasesSectionProps {
  phases: {
    items?: { id: string; name: string; description: string; duration: number; activities: { id: string; name: string }[] }[];
  };
}

const PhasesSection = ({ phases }: PhasesSectionProps) => {
  const items = phases.items ?? [];
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Fases de la Cotización</Text>
      {items.length === 0 && (
        <Text style={styles.emptyText}>No se definieron fases</Text>
      )}
      {items.map((phase, index) => (
        <View key={phase.id} style={styles.phaseRow}>
          <Text style={styles.phaseName}>
            {index + 1}. {phase.name}
          </Text>
          <Text style={styles.phaseMeta}>
            Duración: {phase.duration} día(s)
          </Text>
          {phase.description && (
            <Text style={styles.phaseDesc}>{phase.description}</Text>
          )}
          {phase.activities.length > 0 && (
            <View style={styles.activityList}>
              {phase.activities.map((act, actIdx) => (
                <Text key={act.id} style={styles.activityItem}>
                  {actIdx + 1}. {act.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default PhasesSection;
