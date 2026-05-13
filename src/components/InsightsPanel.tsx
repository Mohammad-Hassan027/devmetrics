import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Zap, Lightbulb } from "lucide-react";
import type { Insight } from "../utils/scoreCalculator";
import { generateInsights } from "../utils/scoreCalculator";
import type { DevStats } from "../types";
import { cn } from "../utils/cn";

interface InsightsPanelProps {
  stats: DevStats;
  isLoading: boolean;
}

export default function InsightsPanel({ stats, isLoading }: InsightsPanelProps) {
  if (isLoading) return <InsightsSkeleton />;

  const insights = generateInsights(stats);

  if (insights.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h2 className="text-xl font-bold text-white">Personalized Insights</h2>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, idx) => (
          <InsightCard key={idx} insight={insight} index={idx} />
        ))}
      </div>
    </motion.div>
  );
}

function InsightCard({ insight, index }: { insight: Insight; index: number }) {
  const priorityConfig = {
    high: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: AlertCircle,
      color: "text-red-400",
      badge: "bg-red-500/20 text-red-300",
    },
    medium: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      icon: Zap,
      color: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
    },
    low: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: CheckCircle2,
      color: "text-green-400",
      badge: "bg-green-500/20 text-green-300",
    },
  };

  const config = priorityConfig[insight.priority];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "rounded-2xl p-6 border",
        config.bg,
        config.border,
        "backdrop-blur-sm"
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-white">{insight.title}</h3>
            <span
              className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
                config.badge
              )}
            >
              {insight.priority.charAt(0).toUpperCase() + insight.priority.slice(1)}
            </span>
          </div>

          <p className="text-slate-300 text-sm mb-4 leading-relaxed">
            {insight.description}
          </p>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Action Items
            </p>
            <ul className="space-y-2">
              {insight.actionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="text-slate-500 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-6 w-40 bg-surface-700 rounded-lg animate-pulse" />
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl p-6 bg-surface-800 border border-white/5 space-y-3"
        >
          <div className="h-5 w-32 bg-surface-700 rounded animate-pulse" />
          <div className="h-4 w-full bg-surface-700 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-3 w-20 bg-surface-700 rounded animate-pulse" />
            <div className="h-3 w-full bg-surface-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
