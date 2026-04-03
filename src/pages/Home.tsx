import { useDevMetrics } from "../context/DevMetricsContext";
import UsernameForm from "../components/UsernameForm";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const { usernames, clearUsernames } = useDevMetrics();

  return (
    <div className="animate-fade-in">
      {!usernames ? (
        <>
          <HeroSection />
          <UsernameForm />
        </>
      ) : (
        <Dashboard usernames={usernames} onReset={clearUsernames} />
      )}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-brand-900/20 border border-brand-700/20 rounded-full px-4 py-1.5 mb-6 shadow-sm">
        <span className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-slow shadow-[0_0_8px_rgba(255,90,31,0.8)]" />
        <span className="text-brand-400 text-xs font-semibold tracking-wider uppercase">
          Developer Analytics
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
        Track Your{" "}
        <span className="bg-gradient-to-r from-brand-400 to-white bg-clip-text text-transparent">
          Dev Journey
        </span>
      </h1>
      <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
        Aggregate your GitHub contributions, LeetCode stats, and GFG scores into
        one beautiful dashboard.
      </p>
    </div>
  );
}
