import { useDevMetrics } from "./context/DevMetricsContext";
import Navbar from "./components/Navbar";
import UsernameForm from "./components/UsernameForm";
import Dashboard from "./components/Dashboard";

export default function App() {
  const { usernames, clearUsernames } = useDevMetrics();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onLogoClick={clearUsernames} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl">
        {!usernames ? (
          <div className="animate-fade-in">
            <HeroSection />
            <UsernameForm />
          </div>
        ) : (
          <div className="animate-fade-in">
            <Dashboard usernames={usernames} onReset={clearUsernames} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 bg-brand-900/30 border border-brand-700/30 rounded-full px-4 py-1.5 mb-6">
        <span className="w-2 h-2 bg-brand-400 rounded-full animate-pulse-slow" />
        <span className="text-brand-300 text-xs font-medium tracking-wide uppercase">
          Developer Analytics
        </span>
      </div>
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 tracking-tight">
        Track Your{" "}
        <span className="bg-gradient-to-r from-brand-400 to-blue-400 bg-clip-text text-transparent">
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

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} DevMetrics. Built for developers.
        </p>
        <div className="flex items-center gap-4 text-slate-600 text-sm">
          <a href="#" className="hover:text-slate-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-slate-400 transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
