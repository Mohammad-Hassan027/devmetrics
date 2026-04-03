import { useState, type FormEvent } from "react";
import { useDevMetrics } from "../context/DevMetricsContext";
import type { Usernames } from "../types";

const PLATFORMS = [
  {
    key: "github" as const,
    label: "GitHub",
    placeholder: "your-github-username",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
    color: "text-slate-300",
    accentBg: "bg-slate-700/30",
    accentBorder: "border-slate-600/30",
  },
  {
    key: "leetcode" as const,
    label: "LeetCode",
    placeholder: "your-leetcode-username",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    ),
    color: "text-yellow-400",
    accentBg: "bg-yellow-900/20",
    accentBorder: "border-yellow-700/30",
  },
  {
    key: "gfg" as const,
    label: "GeeksforGeeks",
    placeholder: "your-gfg-username",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-.608.177 4.45 4.45 0 0 1-.668.073h-.066v.006H5.56v-.006h-.067a4.45 4.45 0 0 1-.668-.073 4.51 4.51 0 0 1-.608-.177 3.691 3.691 0 0 1-1.104-.695 2.933 2.933 0 0 1-.565-.745A2.628 2.628 0 0 1 2.243 13c0-.414.091-.8.305-1.129.21-.322.48-.569.78-.756a3.573 3.573 0 0 1-.307-1.645 3.578 3.578 0 0 1 .535-1.847A3.564 3.564 0 0 1 4.807 6.41a3.57 3.57 0 0 1 1.944-.53 3.57 3.57 0 0 1 2.405.919 4.6 4.6 0 0 1 2.844-.998 4.6 4.6 0 0 1 2.844.998 3.57 3.57 0 0 1 2.405-.92 3.57 3.57 0 0 1 1.945.531 3.564 3.564 0 0 1 1.25 1.213 3.578 3.578 0 0 1 .535 1.847 3.573 3.573 0 0 1-.307 1.645c.3.187.57.434.78.756.214.33.305.715.305 1.13 0 .466-.105.897-.307 1.314zm-9.45-.764c.358 0 .57-.207.57-.57V8.21c0-.363-.212-.57-.57-.57-.357 0-.569.207-.569.57v4.77c0 .364.212.571.569.571z" />
      </svg>
    ),
    color: "text-green-400",
    accentBg: "bg-green-900/20",
    accentBorder: "border-green-700/30",
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
    <div className="max-w-2xl mx-auto">
      <div className="glass-card p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-1">
            Connect Your Profiles
          </h2>
          <p className="text-slate-400 text-sm">
            Enter at least one username to generate your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} id="username-form" className="space-y-5">
          {PLATFORMS.map((platform, i) => (
            <div
              key={platform.key}
              className="animate-slide-up"
              style={{
                animationDelay: `${i * 80}ms`,
                animationFillMode: "both",
              }}
            >
              <label
                htmlFor={`input-${platform.key}`}
                className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2"
              >
                {platform.label}
              </label>
              <div className="relative">
                <div
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${platform.color} pointer-events-none`}
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
                  className="input-field pl-11"
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>
            </div>
          ))}

          <div className="pt-2">
            <button
              id="submit-btn"
              type="submit"
              disabled={!isValid || isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2.5 py-3.5 text-base"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin w-5 h-5 text-white/70"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Fetching your stats…
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Analyze My Stats
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-5 text-center text-xs text-slate-600">
          🔒 We don't store your data — all stats are fetched client-side.
        </p>
      </div>
    </div>
  );
}
