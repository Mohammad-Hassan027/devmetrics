import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Share2, ArrowRight } from "lucide-react";
import { useDevMetrics } from "../context/DevMetricsContext";
import Dashboard from "../components/Dashboard";
import RecruiterReadiness from "../components/RecruiterReadiness";
import InsightsPanel from "../components/InsightsPanel";
import { cn } from "../utils/cn";

export default function PublicProfile() {
  const [searchParams] = useSearchParams();
  const { submitUsernames, stats, isLoading } = useDevMetrics();
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    const gh = searchParams.get("gh") || "";
    const lc = searchParams.get("lc") || "";
    const gfg = searchParams.get("gfg") || "";

    if (gh || lc || gfg) {
      submitUsernames({ github: gh, leetcode: lc, gfg });
      setHasInitialized(true);
    }
  }, [searchParams, submitUsernames, hasInitialized]);

  const gh = searchParams.get("gh");
  const lc = searchParams.get("lc");
  const gfg = searchParams.get("gfg");

  if (!gh && !lc && !gfg) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto text-center py-20"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Invalid Profile Link
        </h1>
        <p className="text-slate-400 mb-8">
          This profile link doesn't contain any valid usernames. Please check the URL and try again.
        </p>
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "bg-gradient-to-r from-brand-500 to-brand-600 text-white",
            "hover:shadow-lg hover:shadow-brand-500/50 transition-all font-medium"
          )}
        >
          Create Your Profile
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20">
          <Share2 className="w-4 h-4 text-brand-400" />
          <span className="text-sm font-medium text-brand-300">
            Shareable Developer Profile
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Developer Metrics
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          This profile showcases developer metrics from GitHub, LeetCode, and GeeksforGeeks.
        </p>
      </motion.div>

      {/* Recruiter Readiness Score */}
      <RecruiterReadiness stats={stats} isLoading={isLoading} />

      {/* Main Dashboard */}
      <div>
        <Dashboard
          usernames={{ github: gh || "", leetcode: lc || "", gfg: gfg || "" }}
          onReset={() => {
            window.location.href = "/";
          }}
        />
      </div>

      {/* Insights */}
      <InsightsPanel stats={stats} isLoading={isLoading} />

      {/* Footer CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-12 pt-8 border-t border-white/5 text-center space-y-4"
      >
        <p className="text-slate-400">
          Want to create your own developer metrics profile?
        </p>
        <a
          href="/"
          className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-lg",
            "bg-gradient-to-r from-brand-500 to-brand-600 text-white",
            "hover:shadow-lg hover:shadow-brand-500/50 transition-all font-medium"
          )}
        >
          Create Your Profile
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}
