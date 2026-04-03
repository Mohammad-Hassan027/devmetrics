import type { ReactNode } from "react";
import type { FetchStatus } from "../types";
import StatCard from "./StatCard";

export interface StatDef {
  label: string;
  value: number | string | null;
  icon: string;
  color: string;
  badge: string;
}

interface PlatformSectionProps {
  id: string;
  title: string;
  username: string;
  status: FetchStatus;
  error: string | null;
  accentColor: string;
  icon: ReactNode;
  stats: StatDef[];
  avatar?: string;
  profileUrl?: string;
  bio?: string;
}

export default function PlatformSection({
  id,
  title,
  username,
  status,
  error,
  accentColor,
  icon,
  stats,
  avatar,
  profileUrl,
  bio,
}: PlatformSectionProps) {
  return (
    <section id={id} className="animate-slide-up space-y-4">
      {/* Section header */}
      <div className={`flex items-center gap-3 pl-4 border-l-2 ${accentColor}`}>
        <div className="p-1.5 rounded-lg bg-surface-600/50 shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white leading-tight">
              {title}
            </h3>
            <StatusBadge status={status} />
          </div>
          {username && (
            <p className="text-slate-500 text-xs truncate">@{username}</p>
          )}
          {bio && <p className="text-slate-500 text-xs truncate">{bio}</p>}
        </div>
        {avatar && (
          <a
            href={profileUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <img
              src={avatar}
              alt={`${title} avatar`}
              className="w-9 h-9 rounded-full ring-2 ring-white/10 hover:ring-brand-500/50 transition-all"
            />
          </a>
        )}
      </div>

      {/* Error banner */}
      {status === "error" && error && (
        <div
          id={`${id}-error`}
          className="flex items-start gap-3 bg-red-950/40 border border-red-800/40
                     rounded-xl px-4 py-3 text-red-400 text-sm"
          role="alert"
        >
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            badge={stat.badge}
            loading={status === "loading"}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: FetchStatus }) {
  if (status === "idle") return null;

  const map: Record<
    Exclude<FetchStatus, "idle">,
    { label: string; cls: string }
  > = {
    loading: {
      label: "Loading",
      cls: "bg-yellow-900/40 text-yellow-400 border-yellow-700/40",
    },
    success: {
      label: "Live",
      cls: "bg-green-900/40  text-green-400  border-green-700/40",
    },
    error: {
      label: "Failed",
      cls: "bg-red-900/40    text-red-400    border-red-700/40",
    },
  };

  const { label, cls } = map[status];

  return (
    <span className={`badge border text-[10px] ${cls}`}>
      {status === "loading" && (
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse inline-block" />
      )}
      {label}
    </span>
  );
}
