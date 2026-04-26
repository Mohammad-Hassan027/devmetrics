import { useState, type FormEvent } from "react";
import { useDevMetrics } from "../context/DevMetricsContext";
import type { Usernames } from "../types";
import { Code2, Zap, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../utils/cn";

const PLATFORMS = [
  {
    key: "github" as const,
    label: "GitHub",
    placeholder: "torvalds",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "text-slate-300 focus-within:text-white",
  },
  {
    key: "leetcode" as const,
    label: "LeetCode",
    placeholder: "johndoe",
    icon: <Code2 className="w-5 h-5" />,
    color: "text-yellow-500/70 focus-within:text-yellow-400",
  },
  {
    key: "gfg" as const,
    label: "GeeksforGeeks",
    placeholder: "johndoe",
    icon: <Zap className="w-5 h-5" />,
    color: "text-green-500/70 focus-within:text-green-400",
  },
];

export default function UsernameForm() {
  const { submitUsernames, isLoading } = useDevMetrics();
  const [values, setValues] = useState<Usernames>({
    github: "",
    leetcode: "",
    gfg: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!values.github && !values.leetcode && !values.gfg) return;
    submitUsernames(values);
  };

  const isValid =
    values.github.trim() || values.leetcode.trim() || values.gfg.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="bg-surface-800 border border-white/5 ring-1 ring-white/5 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
        {/* Subtle mesh background detail inside form */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
            Sync your profiles
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            Provide your usernames to generate a real-time visualization of your engineering output.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="username-form" className="space-y-5">
          {PLATFORMS.map((platform, i) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
              key={platform.key}
              className="space-y-2 group"
            >
              <label
                htmlFor={`input-${platform.key}`}
                className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest pl-1 transition-colors group-focus-within:text-slate-300"
              >
                {platform.label}
              </label>
              <div className="relative">
                <div
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
                    platform.color,
                  )}
                >
                  {platform.icon}
                </div>
                <input
                  id={`input-${platform.key}`}
                  type="text"
                  value={values[platform.key]}
                  onChange={(e) =>
                    setValues((v) => ({ ...v, [platform.key]: e.target.value }))
                  }
                  placeholder={platform.placeholder}
                  className="input-field pl-[3.25rem] py-3.5 bg-surface-900 border border-surface-600 focus:border-brand-500 rounded-xl w-full text-slate-200 placeholder-surface-500 transition-all focus:ring-1 focus:ring-brand-500 outline-none"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="pt-4"
          >
            <button
              id="submit-btn"
              type="submit"
              disabled={!isValid || isLoading}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 py-4 text-sm font-bold tracking-wide rounded-xl transition-all duration-300",
                "bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-500/20 hover:shadow-brand-500/40",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-600 disabled:hover:shadow-brand-500/20",
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-white/80" />
                  Aggregating data...
                </>
              ) : (
                <>
                  Build my dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-500 font-medium">
          Architected for privacy. All stats are fetched client-side and never stored.
        </p>
      </div>
    </motion.div>
  );
}
