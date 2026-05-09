import { useDevMetrics } from "../context/DevMetricsContext";
import UsernameForm from "../components/UsernameForm";
import Dashboard from "../components/Dashboard";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

export default function Home() {
  const { usernames, clearUsernames } = useDevMetrics();

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center">
      {!usernames ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex flex-col items-center pt-10 pb-20"
        >
          <HeroSection />
          <div className="flex flex-col items-center gap-4">
            <UsernameForm />
          </div>
        </motion.div>
      ) : (
        <Dashboard usernames={usernames} onReset={clearUsernames} />
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div className="text-center mb-16 max-w-3xl mx-auto flex flex-col items-center">
      {/* Beta / Announcement Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 rounded-full px-4 py-1.5 mb-8 shadow-[0_0_15px_rgba(255,90,31,0.1)]"
      >
        <Activity className="w-3.5 h-3.5 text-brand-500" />
        <span className="text-brand-400 text-xs font-semibold tracking-wider uppercase">
          Engineering Intelligence
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]"
      >
        Engineering impact, <br className="hidden sm:block" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-white to-slate-400">
          quantified.
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed font-medium"
      >
        Sync your GitHub, LeetCode, and GFG profiles to baseline your technical
        reach and problem-solving distribution in one unified dashboard.
      </motion.p>
    </div>
  );
}
