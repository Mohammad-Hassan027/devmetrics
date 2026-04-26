import { ReactNode, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "./Skeleton";
import { cn } from "../utils/cn";

export interface StatCardProps {
  label: string;
  value: number | string | null;
  icon: ReactNode;
  badge: string;
  loading?: boolean;
  index?: number;
}

export default function StatCard({
  label,
  value,
  icon,
  badge,
  loading = false,
  index = 0,
}: StatCardProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current || isFocused) return;
    const div = divRef.current;
    const rect = div.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const isEmpty = value === null || value === undefined;
  const displayValue = isEmpty ? "—" : String(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "stat-card relative overflow-hidden text-left bg-surface-800",
        "group transition-all duration-500",
      )}
    >
      {/* Spotlight Effect overlay */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500 rounded-3xl"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.04), transparent 40%)`,
        }}
      />

      <div className="relative flex items-center justify-between mb-8">
        <div className="p-3 rounded-2xl bg-surface-900 border border-white/[0.03] shadow-inner text-slate-400 group-hover:text-brand-400 transition-colors duration-300">
          {icon}
        </div>
        <span className="badge opacity-60 group-hover:opacity-100 transition-opacity">
          {badge}
        </span>
      </div>

      <div className="relative mt-auto">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-28 rounded-lg" />
            <Skeleton className="h-4 w-20 rounded-md" />
          </div>
        ) : isEmpty ? (
          <div className="space-y-1.5 pt-2">
            <p className="text-4xl font-medium text-surface-600 tracking-tight select-none">
              —
            </p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</p>
          </div>
        ) : (
          <div className="space-y-1.5 pt-2">
            <p className="text-4xl font-medium text-white tracking-tight font-mono group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-slate-500 transition-all duration-500">
              {displayValue}
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-300 transition-colors">
              {label}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
