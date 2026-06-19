import { AppShell } from "@/components/shell";
import { CheckpointIntelligencePage } from "@/components/notifications/NotificationAlertCenter";

export default function CheckpointIntelligence() {
  return (
    <AppShell title="Checkpoint Intelligence" eyebrow="Live checkpoint feed">
      <CheckpointIntelligencePage />
    </AppShell>
  );
}
