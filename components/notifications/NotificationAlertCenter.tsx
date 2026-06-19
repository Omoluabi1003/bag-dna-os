"use client";

import { Bell, CheckCircle2, Clock3, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

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

export function NotificationAlertCenter({ alerts = defaultAlerts }: Pick<NotificationAlertCenterProps, "alerts">) {
  const unreadAlerts = useMemo(() => alerts.filter((alert) => !alert.read), [alerts]);
  const badgeLabel = unreadAlerts.length > 9 ? "9+" : String(unreadAlerts.length);

  return (
    <Link
      href="/checkpoint-intelligence"
      aria-label="Open checkpoint alerts and verification history"
      className="relative grid h-11 min-h-11 w-11 min-w-11 place-items-center rounded-xl border border-white/[.08] bg-white/[.025] text-mist transition duration-[180ms] hover:border-cyan/30 hover:bg-white/[.07] hover:text-ivory active:scale-95 md:h-10 md:min-h-10 md:w-10 md:min-w-10"
    >
      <Bell size={16} />
      <span
        aria-label={`${unreadAlerts.length} unread checkpoint alerts`}
        className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full border border-ink bg-red-400 px-1 text-[9px] font-black leading-none text-white shadow-[0_0_14px_rgba(248,113,113,.35)]"
      >
        {badgeLabel}
      </span>
    </Link>
  );
}

export function CheckpointIntelligencePage({
  alerts = defaultAlerts,
  verificationEvents = defaultVerificationEvents,
  custodyNotes = defaultCustodyNotes,
}: NotificationAlertCenterProps) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/[.10] bg-[#081927] shadow-2xl shadow-black/20 ring-1 ring-cyan/10">
      <div className="border-b border-white/[.08] px-5 pb-5 pt-6 md:px-8 md:py-8">
        <p className="text-[10px] font-bold uppercase tracking-[.18em] text-gold">Live checkpoint feed</p>
        <h2 id="checkpoint-intelligence-title" className="mt-2 font-display text-3xl font-semibold text-ivory md:text-4xl">
          Checkpoint Intelligence
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-mist md:text-base">
          Live alerts, sensor events, custody notes, and verification history.
        </p>
      </div>

      <div className="space-y-7 px-5 py-6 md:px-8 md:py-8">
        <section>
          <SectionHeading icon={<ShieldAlert size={18} />} label="Priority Alerts" />
          {alerts.length === 0 ? (
            <EmptyState>No active checkpoint alerts.</EmptyState>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {alerts.map((alert) => (
                <article key={alert.id} className="rounded-3xl border border-white/[.08] bg-white/[.04] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wider ${severityClass(alert.severity)}`}>
                      {alert.severity}
                    </span>
                    {!alert.read && <span className="h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_rgba(110,216,224,.8)]" />}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ivory">{alert.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-mist">{alert.message}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-mist">
                    <span className="rounded-full bg-white/[.05] px-3 py-1.5">{alert.checkpoint}</span>
                    {alert.confidence && <span className="rounded-full bg-cyan/10 px-3 py-1.5 text-cyan">{alert.confidence}</span>}
                    <span className="rounded-full bg-white/[.05] px-3 py-1.5">{formatCheckpointTime(alert.timestamp)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section>
          <SectionHeading icon={<Clock3 size={18} />} label="Recent Verification Events" />
          {verificationEvents.length === 0 ? (
            <EmptyState>No recent verification events.</EmptyState>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2">
              {verificationEvents.map((event) => (
                <article key={event.id} className="rounded-3xl border border-white/[.08] bg-[#0b2134]/70 p-5">
                  <div className="flex items-center gap-3 text-cyan">
                    <CheckCircle2 size={18} />
                    <h3 className="text-lg font-bold text-ivory">{event.eventType}</h3>
                  </div>
                  <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-3">
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
          <SectionHeading icon={<ExternalLink size={18} />} label="Related full pages" />
          <div className="grid gap-3 md:grid-cols-3">
            <PageLink href="/verification-center">Verification Center</PageLink>
            <PageLink href="/custody">Custody Control</PageLink>
            <PageLink href="/scanner">Live Checkpoint Scanner</PageLink>
          </div>
        </section>

        <section>
          <SectionHeading icon={<FileText size={18} />} label="Custody Notes" />
          {custodyNotes.length === 0 ? (
            <EmptyState>No custody notes recorded.</EmptyState>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {custodyNotes.map((note) => (
                <article key={note.id} className="rounded-3xl border border-white/[.08] bg-white/[.04] p-5 text-sm text-mist">
                  <p className="text-ivory">{note.note}</p>
                  <p className="mt-2 text-xs text-mist">{note.createdBy} · {formatCheckpointTime(note.timestamp)}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function SectionHeading({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="mb-4 flex items-center gap-3 text-xs font-black uppercase tracking-[.16em] text-gold">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/10 text-gold">{icon}</span>
      {label}
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-white/[.10] bg-white/[.025] p-5 text-sm text-mist">{children}</div>;
}

function EventMeta({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/[.06] bg-white/[.03] p-3">
      <dt className="text-[10px] uppercase tracking-wider text-mist/70">{label}</dt>
      <dd className={`mt-2 truncate font-semibold ${highlight ? "text-cyan" : "text-ivory"}`}>{value}</dd>
    </div>
  );
}

function PageLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-2xl border border-cyan/15 bg-cyan/[.08] px-4 py-3 text-sm font-bold text-ivory transition hover:border-cyan/35 hover:bg-cyan/[.13]"
    >
      <span>{children}</span>
      <ExternalLink size={15} className="text-cyan" />
    </Link>
  );
}
