interface NavbarProps {
  onLogoClick: () => void;
}

export default function Navbar({ onLogoClick }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-surface-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            id="navbar-logo"
            onClick={onLogoClick}
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Go to home"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-900/50 group-hover:shadow-brand-700/40 transition-shadow duration-300">
                <svg
                  className="w-4.5 h-4.5 text-white"
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
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-brand-400 rounded-full ring-2 ring-surface-900" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors duration-200">
              Dev<span className="text-brand-400">Metrics</span>
            </span>
          </button>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6">
            <a
              href="#"
              id="nav-features"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#"
              id="nav-docs"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              Docs
            </a>
            <a
              href="#"
              id="nav-about"
              className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
            >
              About
            </a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <button
              id="nav-signin"
              className="hidden sm:block text-sm text-slate-400 hover:text-white transition-colors duration-200 focus:outline-none"
            >
              Sign In
            </button>
            <button
              id="nav-getstarted"
              className="btn-primary text-sm px-4 py-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
