import { Routes, Route, Link } from "react-router-dom";
import { useDevMetrics } from "./context/DevMetricsContext";
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import Docs from "./pages/Docs";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

export default function App() {
  const { clearUsernames } = useDevMetrics();

  return (
    <div className="min-h-screen flex flex-col relative z-0">
      <Navbar onLogoClick={clearUsernames} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-7xl relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="border-t border-white/5 py-6 mt-12 relative z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-slate-600 text-sm">
          © {new Date().getFullYear()} DevMetrics. Built for developers.
        </p>
        <div className="flex items-center gap-4 text-slate-600 text-sm">
          <Link
            to="/privacy"
            className="hover:text-slate-400 transition-colors"
          >
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-slate-400 transition-colors">
            Terms
          </Link>
          <a
            href="https://github.com/Mohammad-Hassan027/devmetrics"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-400 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
