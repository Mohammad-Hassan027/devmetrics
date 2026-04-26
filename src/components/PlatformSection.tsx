import { ReactNode } from "react";
import type { FetchStatus } from "../types";
import StatCard from "./StatCard";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";

export interface StatDef {
  label: string;
  value: number | string | null;
  icon: ReactNode;
  badge: string;
}

interface PlatformSectionProps {
  id: string;
  title: string;
  username: string;
  status: FetchStatus;
  error: string | null;
  accentColor: string; // Used for left border highlight
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
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="col-span-1 md:col-span-6 xl:col-span-6 space-y-5"
    >
      {/* Section header */}
      <div
        className={cn("flex items-center gap-5 pl-6 border-l-[3px]", accentColor)}
      >
        <div className="p-3 rounded-2xl bg-surface-900 border border-white/[0.03] shadow-inner shrink-0 text-slate-400">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="text-xl font-bold text-white leading-tight tracking-tight">
              {title}
            </h3>
            <StatusBadge status={status} />
          </div>
          {username && (
            <p className="text-slate-500 text-sm truncate font-medium mt-0.5">
              @{username}
            </p>
          )}
          {bio && (
            <p className="text-slate-500 text-xs truncate mt-1 tracking-wide">{bio}</p>
          )}
        </div>
        {avatar && (
          <a
            href={profileUrl ?? "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 group"
          >
            <img
              src={avatar}
              alt={`${title} avatar`}
              className="w-12 h-12 rounded-2xl ring-2 ring-white/[0.03] group-hover:ring-brand-500/30 group-hover:-translate-y-1 transition-all duration-500 outline-none grayscale-[0.5] group-hover:grayscale-0 shadow-2xl"
            />
          </a>
        )}
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {status === "error" && error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            id={`${id}-error`}
            className="flex items-start gap-3 bg-red-950/20 border border-red-900/50 rounded-xl px-4 py-3 text-red-400 text-sm overflow-hidden"
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
            <span className="font-medium">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            badge={stat.badge}
            loading={status === "loading"}
            index={i}
          />
        ))}
      </div>
    </motion.section>
  );
}

function StatusBadge({ status }: { status: FetchStatus }) {
  if (status === "idle") return null;

  const map: Record<
    Exclude<FetchStatus, "idle">,
    { label: string; cls: string }
  > = {
    loading: {
      label: "Synchronizing",
      cls: "bg-[#f59e0b1a] text-[#f59e0b] border-[#f59e0b33]",
    },
    success: {
      label: "Live",
      cls: "bg-[#10b9811a] text-[#10b981] border-[#10b98133]",
    },
    error: {
      label: "Failed",
      cls: "bg-[#ef44441a] text-[#ef4444] border-[#ef444433]",
    },
  };

  const { label, cls } = map[status];

  return (
    <span
      className={cn(
        "badge shrink-0 border transition-all duration-300",
        cls,
      )}
    >
      {status === "loading" && (
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse inline-block" />
      )}
      {label}
    </span>
  );
}
