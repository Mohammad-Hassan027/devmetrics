import { Routes, Route, Link } from "react-router-dom";
import { useDevMetrics } from "./context/DevMetricsContext";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Features from "./pages/Features";
import Docs from "./pages/Docs";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import QuestionTrackerPage from "./pages/QuestionTracker";

export default function App() {
  const { clearUsernames } = useDevMetrics();

  return (
    <div className="relative z-0 flex flex-col min-h-screen">
      <AuthProvider>
        <Navbar onLogoClick={clearUsernames} />

        <main className="container relative z-10 flex-1 px-4 py-10 mx-auto sm:px-6 lg:px-8 max-w-7xl">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/about" element={<About />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/tracker"
              element={
                <ProtectedRoute>
                  <QuestionTrackerPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>

        <Footer />
      </AuthProvider>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="relative z-10 py-6 mt-12 border-t border-white/5">
      <div className="container flex flex-col items-center justify-between gap-3 px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl sm:flex-row">
        <p className="text-sm text-slate-600">
          © {new Date().getFullYear()} DevMetrics. Built for developers.
        </p>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <Link
            to="/privacy"
            className="transition-colors hover:text-slate-400"
          >
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-slate-400">
            Terms
          </Link>
          <a
            href="https://github.com/Mohammad-Hassan027/devmetrics"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-slate-400"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
