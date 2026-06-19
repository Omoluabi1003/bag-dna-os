"use client";

import { Bell, CheckCircle2, Clock3, FileText, ShieldAlert, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useModalManager } from "@/components/ui/ModalManager";

export type CheckpointAlertSeverity = "info" | "warning" | "critical";

export type CheckpointAlert = {
  id: string;
  severity: CheckpointAlertSeverity;
  title: string;
  message: string;
  checkpoint: string;
  confidence?: string;
  timestamp: string;
  read: boolean;
};

export type VerificationEvent = {
  id: string;
  checkpoint: string;
  assetId: string;
  eventType: string;
  confidence: string;
  timestamp: string;
  operator: string;
};

export type CustodyNote = {
  id: string;
  note: string;
  createdBy: string;
  timestamp: string;
};

type NotificationAlertCenterProps = {
  alerts?: CheckpointAlert[];
  verificationEvents?: VerificationEvent[];
  custodyNotes?: CustodyNote[];
};

const defaultAlerts: CheckpointAlert[] = [
  {
    id: "alert-001",
    severity: "info",
    title: "Identity verified",
    message: "RFID, NFC, and QR signals matched at Conveyor Intake.",
    checkpoint: "Conveyor Intake",
    confidence: "100%",
    timestamp: "2026-06-15T18:49:00-04:00",
    read: false,
  },
];

const defaultVerificationEvents: VerificationEvent[] = [
  {
    id: "event-001",
    checkpoint: "Conveyor Intake",
    assetId: "E2-80-BB-7A-53-8B",
    eventType: "Multisensor verification",
    confidence: "100%",
    operator: "Current Operator",
    timestamp: "2026-06-15T18:49:00-04:00",
  },
];

const defaultCustodyNotes: CustodyNote[] = [];

function formatCheckpointTime(timestamp: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function severityClass(severity: CheckpointAlertSeverity) {
  if (severity === "critical") return "border-red-400/25 bg-red-400/10 text-red-200";
  if (severity === "warning") return "border-gold/30 bg-gold/10 text-gold";
  return "border-cyan/25 bg-cyan/10 text-cyan";
}

export function NotificationAlertCenter({
  alerts = defaultAlerts,
  verificationEvents = defaultVerificationEvents,
  custodyNotes = defaultCustodyNotes,
}: NotificationAlertCenterProps) {
  const [isAlertCenterOpen, setIsAlertCenterOpen] = useState(false);
  const unreadAlerts = useMemo(() => alerts.filter((alert) => !alert.read), [alerts]);
  const badgeLabel = unreadAlerts.length > 9 ? "9+" : String(unreadAlerts.length);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const { registerModal, closeModal } = useModalManager();

  useEffect(() => {
    if (!isAlertCenterOpen) return;
    registerModal("checkpoint-alert-center", () => setIsAlertCenterOpen(false), triggerRef.current);
    return () => closeModal("checkpoint-alert-center");
  }, [closeModal, isAlertCenterOpen, registerModal]);

  function closeAlertCenter() {
    setIsAlertCenterOpen(false);
    closeModal("checkpoint-alert-center");
  }

  function handleCloseControl(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    closeAlertCenter();
  }

  return (
    <>
      <button
        type="button"
        aria-label="Open checkpoint alerts and verification history"
        aria-expanded={isAlertCenterOpen}
        ref={triggerRef}
        onClick={() => setIsAlertCenterOpen(true)}
        className={`relative grid h-11 min-h-11 w-11 min-w-11 place-items-center rounded-xl border text-mist transition duration-[180ms] active:scale-95 md:h-10 md:min-h-10 md:w-10 md:min-w-10 ${
          isAlertCenterOpen
            ? "border-cyan/45 bg-cyan/10 text-cyan shadow-[0_0_24px_rgba(110,216,224,.16)]"
            : "border-white/[.08] bg-white/[.025] hover:border-cyan/30 hover:bg-white/[.07] hover:text-ivory"
        }`}
      >
        <Bell size={16} />
        <span
          aria-label={`${unreadAlerts.length} unread checkpoint alerts`}
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border border-ink bg-red-400 px-1 text-[9px] font-black leading-none text-white shadow-[0_0_14px_rgba(248,113,113,.35)]"
        >
          {badgeLabel}
        </span>
      </button>

      <div
        aria-hidden={!isAlertCenterOpen}
        className={`fixed inset-0 z-[70] bg-black/25 backdrop-blur-[1px] transition-opacity duration-[180ms] ${
          isAlertCenterOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeAlertCenter}
      />

      <aside
        role={isAlertCenterOpen ? "dialog" : undefined}
        aria-modal={isAlertCenterOpen ? "true" : undefined}
        aria-hidden={!isAlertCenterOpen}
        inert={!isAlertCenterOpen ? true : undefined}
        aria-labelledby="checkpoint-intelligence-title"
        className={`fixed inset-x-0 bottom-0 z-[90] max-h-[86vh] overflow-hidden overscroll-contain rounded-t-[28px] border border-white/[.10] bg-[#081927]/98 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-[180ms] md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-[380px] md:rounded-l-[28px] md:rounded-r-none ${
          isAlertCenterOpen ? "pointer-events-auto translate-y-0 md:translate-x-0" : "pointer-events-none translate-y-full md:translate-x-full md:translate-y-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-full max-h-[86vh] flex-col md:max-h-none">
          <div className="border-b border-white/[.08] px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-6 md:pt-6">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-white/20 md:hidden" />
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Live checkpoint feed</p>
                <h2 id="checkpoint-intelligence-title" className="mt-1 font-display text-xl font-semibold text-ivory">
                  Checkpoint Intelligence
                </h2>
                <p className="mt-2 text-xs leading-5 text-mist">
                  Live alerts, sensor events, custody notes, and verification history.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close checkpoint intelligence"
                onClick={handleCloseControl}
                className="relative z-[100] grid h-12 w-12 shrink-0 touch-manipulation place-items-center rounded-xl border border-white/[.12] bg-white/[.08] text-mist transition hover:bg-white/[.12] hover:text-ivory active:scale-95 md:h-10 md:w-10"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <div className="scrollbar-none flex-1 touch-pan-y space-y-5 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-6">
            <section>
              <SectionHeading icon={<ShieldAlert size={14} />} label="Priority Alerts" />
              {alerts.length === 0 ? (
                <EmptyState>No active checkpoint alerts.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {alerts.map((alert) => (
                    <article key={alert.id} className="rounded-2xl border border-white/[.08] bg-white/[.04] p-4">
                      <div className="flex items-start justify-between gap-3">
                        <span className={`rounded-full border px-2 py-1 text-[9px] font-black uppercase tracking-wider ${severityClass(alert.severity)}`}>
                          {alert.severity}
                        </span>
                        {!alert.read && <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_12px_rgba(110,216,224,.8)]" />}
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-ivory">{alert.title}</h3>
                      <p className="mt-1 text-xs leading-5 text-mist">{alert.message}</p>
                      <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-mist">
                        <span className="rounded-full bg-white/[.05] px-2 py-1">{alert.checkpoint}</span>
                        {alert.confidence && <span className="rounded-full bg-cyan/10 px-2 py-1 text-cyan">{alert.confidence}</span>}
                        <span className="rounded-full bg-white/[.05] px-2 py-1">{formatCheckpointTime(alert.timestamp)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeading icon={<Clock3 size={14} />} label="Recent Verification Events" />
              {verificationEvents.length === 0 ? (
                <EmptyState>No recent verification events.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {verificationEvents.map((event) => (
                    <article key={event.id} className="rounded-2xl border border-white/[.08] bg-[#0b2134]/70 p-4">
                      <div className="flex items-center gap-2 text-cyan">
                        <CheckCircle2 size={15} />
                        <h3 className="text-sm font-bold text-ivory">{event.eventType}</h3>
                      </div>
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                        <EventMeta label="Checkpoint" value={event.checkpoint} />
                        <EventMeta label="Confidence" value={event.confidence} highlight />
                        <EventMeta label="Asset" value={event.assetId} />
                        <EventMeta label="Operator" value={event.operator} />
                        <EventMeta label="Time" value={formatCheckpointTime(event.timestamp)} />
                      </dl>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeading icon={<FileText size={14} />} label="Custody Notes" />
              {custodyNotes.length === 0 ? (
                <EmptyState>No custody notes recorded.</EmptyState>
              ) : (
                <div className="space-y-3">
                  {custodyNotes.map((note) => (
                    <article key={note.id} className="rounded-2xl border border-white/[.08] bg-white/[.04] p-4 text-xs text-mist">
                      <p className="text-ivory">{note.note}</p>
                      <p className="mt-2 text-[10px] text-mist">{note.createdBy} · {formatCheckpointTime(note.timestamp)}</p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </aside>
    </>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[.16em] text-gold">
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-gold/10 text-gold">{icon}</span>
      {label}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-white/[.10] bg-white/[.025] p-4 text-xs text-mist">{children}</div>;
}

function EventMeta({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-white/[.06] bg-white/[.03] p-2">
      <dt className="text-[9px] uppercase tracking-wider text-mist/70">{label}</dt>
      <dd className={`mt-1 truncate font-semibold ${highlight ? "text-cyan" : "text-ivory"}`}>{value}</dd>
    </div>
  );
}
