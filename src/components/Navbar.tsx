import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import UserProfileMenu from "./UserProfileMenu";

interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  const { user, loading, signInWithGoogle } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
      <div className="container px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            id="navbar-logo"
            onClick={onLogoClick}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Go to home"
          >
            <div className="relative">
              <div className="flex items-center justify-center w-8 h-8 transition-colors duration-300 border rounded-lg shadow-md bg-surface-900 border-white/10 group-hover:border-brand-500/50">
                <svg
                  className="w-4.5 h-4.5 text-brand-500"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-500 rounded-full ring-2 ring-surface-900" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white transition-colors duration-200 group-hover:text-slate-200">
              Dev<span className="text-brand-500">Metrics</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="items-center hidden gap-6 sm:flex">
            <Link
              to="/features"
              id="nav-features"
              className="text-sm transition-colors duration-200 text-slate-400 hover:text-white"
            >
              Features
            </Link>
            <Link
              to="/leaderboard"
              id="nav-leaderboard"
              className="text-sm transition-colors duration-200 text-slate-400 hover:text-white"
            >
              Leaderboard
            </Link>
            <Link
              to="/docs"
              id="nav-docs"
              className="text-sm transition-colors duration-200 text-slate-400 hover:text-white"
            >
              Docs
            </Link>
            <Link
              to="/about"
              id="nav-about"
              className="text-sm transition-colors duration-200 text-slate-400 hover:text-white"
            >
              About
            </Link>
            {user && (
              <Link
                to="/tracker"
                id="nav-tracker"
                className="text-sm transition-colors duration-200 text-slate-400 hover:text-white"
              >
                Tracker
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {!loading && !user ? (
              <button
                id="nav-signin"
                onClick={() => signInWithGoogle()}
                className="px-4 py-2 text-sm btn-primary"
              >
                Sign In
              </button>
            ) : loading ? (
              <div className="text-xs text-slate-400">Loading...</div>
            ) : (
              <UserProfileMenu />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
