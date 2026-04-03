import type { Usernames, DevStats, FetchStatus } from "../types";
import { useDevMetrics } from "../context/DevMetricsContext";
import { useExportDashboard } from "../hooks/useExportDashboard";
import PlatformSection from "./PlatformSection";
import type { StatDef } from "./PlatformSection";
import ChartsSection from "./charts/ChartsSection";
import DeveloperScoreCard from "./DeveloperScoreCard";

interface DashboardProps {
  usernames: Usernames;
  onReset: () => void;
}

export default function Dashboard({ usernames, onReset }: DashboardProps) {
  const { stats, isLoading, overallStatus } = useDevMetrics();
  const { exportRef, exportImage, exportState } = useExportDashboard(
    `devmetrics-${usernames.github || usernames.leetcode || "dashboard"}.png`,
  );

  return (
    // exportRef attaches to the capture target
    <div className="space-y-10" ref={exportRef}>
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Dashboard</h2>
          <p className="text-slate-500 text-sm mt-1">
            {overallStatus === "loading" && "Fetching your stats…"}
            {overallStatus === "success" && "All stats loaded successfully."}
            {overallStatus === "partial" && "Some platforms failed to load."}
            {overallStatus === "error" &&
              "All requests failed — check usernames."}
            {overallStatus === "idle" &&
              "Aggregated stats across your connected platforms."}
          </p>
        </div>

        {/* Action buttons */}
        <div className="self-start sm:self-auto flex items-center gap-2">
          {/* Export button */}
          <button
            id="btn-export"
            onClick={() => void exportImage()}
            disabled={exportState === "capturing" || isLoading}
            title="Export dashboard as PNG"
            className="flex items-center gap-2 bg-surface-800 border border-white/10 hover:border-brand-500
                       hover:text-brand-500 text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-black/20"
          >
            {exportState === "capturing" ? (
              <>
                <svg
                  className="animate-spin w-4 h-4"
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
                Capturing…
              </>
            ) : exportState === "done" ? (
              <>
                <svg
                  className="w-4 h-4 text-green-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Saved!
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export PNG
              </>
            )}
          </button>

          {/* Change usernames button */}
          <button
            id="btn-reset"
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-2 bg-surface-800 border border-white/10 hover:border-slate-400
                       hover:text-white text-slate-300 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-300
                       disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-black/20"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
            Change
          </button>
        </div>
      </div>

      {/* ── Profile chips ── */}
      <div className="glass-card p-4 flex flex-wrap gap-3">
        {usernames.github && (
          <ProfilePill
            platform="GitHub"
            username={usernames.github}
            color="bg-surface-800 text-slate-200 border-white/10"
            status={stats.github.status}
          />
        )}
        {usernames.leetcode && (
          <ProfilePill
            platform="LeetCode"
            username={usernames.leetcode}
            color="bg-surface-800 text-slate-200 border-white/10"
            status={stats.leetcode.status}
          />
        )}
        {usernames.gfg && (
          <ProfilePill
            platform="GFG"
            username={usernames.gfg}
            color="bg-surface-800 text-slate-200 border-white/10"
            status={stats.gfg.status}
          />
        )}
      </div>

      {/* ── Developer Score Card ── */}
      <DeveloperScoreCard />

      {/* ── Platform sections ── */}
      {usernames.github && <GitHubSection stats={stats} />}
      {usernames.leetcode && <LeetCodeSection stats={stats} />}
      {usernames.gfg && <GFGSection stats={stats} />}

      {/* ── Charts ── */}
      <ChartsSection stats={stats} />
    </div>
  );
}

// ─── Profile pill ─────────────────────────────────────────────────────────────

function ProfilePill({
  platform,
  username,
  color,
  status,
}: {
  platform: string;
  username: string;
  color: string;
  status: FetchStatus;
}) {
  const dot =
    status === "loading"
      ? "bg-yellow-400 animate-pulse"
      : status === "success"
        ? "bg-green-400"
        : status === "error"
          ? "bg-red-400"
          : "bg-slate-600";

  return (
    <div className={`badge border ${color} gap-2`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
      <span className="font-semibold">{platform}</span>
      <span className="opacity-60">·</span>
      <span>@{username}</span>
    </div>
  );
}

// ─── Platform sections ────────────────────────────────────────────────────────

function GitHubSection({ stats }: { stats: DevStats }) {
  const { data, status, error } = stats.github;
  const statDefs: StatDef[] = [
    {
      label: "Public Repos",
      value: data?.public_repos ?? null,
      icon: "📁",
      color: "from-brand-500/10 to-transparent",
      badge: "Repositories",
    },
    {
      label: "Total Stars",
      value: data?.total_stars ?? null,
      icon: "⭐",
      color: "from-brand-500/10 to-transparent",
      badge: "Stars Earned",
    },
    {
      label: "Followers",
      value: data?.followers ?? null,
      icon: "👥",
      color: "from-brand-500/10 to-transparent",
      badge: "Community",
    },
    {
      label: "Following",
      value: data?.following ?? null,
      icon: "➡️",
      color: "from-brand-500/10 to-transparent",
      badge: "Following",
    },
  ];
  return (
    <PlatformSection
      id="section-github"
      title="GitHub"
      username=""
      status={status}
      error={error}
      avatar={data?.avatar_url}
      profileUrl={data?.html_url}
      bio={data?.bio ?? undefined}
      accentColor="border-l-blue-500"
      icon={<GitHubIcon />}
      stats={statDefs}
    />
  );
}

function LeetCodeSection({ stats }: { stats: DevStats }) {
  const { data, status, error } = stats.leetcode;
  const statDefs: StatDef[] = [
    {
      label: "Total Solved",
      value: data?.totalSolved ?? null,
      icon: "✅",
      color: "from-brand-500/10 to-transparent",
      badge: "Total",
    },
    {
      label: "Easy",
      value: data?.easySolved ?? null,
      icon: "🟢",
      color: "from-brand-500/10 to-transparent",
      badge: "Easy",
    },
    {
      label: "Medium",
      value: data?.mediumSolved ?? null,
      icon: "🟡",
      color: "from-brand-500/10 to-transparent",
      badge: "Medium",
    },
    {
      label: "Hard",
      value: data?.hardSolved ?? null,
      icon: "🔴",
      color: "from-brand-500/10 to-transparent",
      badge: "Hard",
    },
  ];
  return (
    <PlatformSection
      id="section-leetcode"
      title="LeetCode"
      username=""
      status={status}
      error={error}
      avatar={data?.avatar}
      accentColor="border-l-yellow-500"
      icon={<LeetCodeIcon />}
      stats={statDefs}
    />
  );
}

function GFGSection({ stats }: { stats: DevStats }) {
  const { data, status, error } = stats.gfg;
  const statDefs: StatDef[] = [
    {
      label: "Problems Solved",
      value: data?.totalProblemsSolved ?? null,
      icon: "🧩",
      color: "from-brand-500/10 to-transparent",
      badge: "Total",
    },
    {
      label: "Coding Score",
      value: data?.codingScore ?? null,
      icon: "🏆",
      color: "from-brand-500/10 to-transparent",
      badge: "Score",
    },
    {
      label: "Current Streak",
      value: data?.currentStreak ?? null,
      icon: "🔥",
      color: "from-brand-500/10 to-transparent",
      badge: "Days",
    },
    {
      label: "Institute Rank",
      value: data?.instituteRank ?? null,
      icon: "🎓",
      color: "from-brand-500/10 to-transparent",
      badge: "Rank",
    },
  ];
  return (
    <PlatformSection
      id="section-gfg"
      title="GeeksforGeeks"
      username=""
      status={status}
      error={error}
      avatar={data?.profilePicture}
      accentColor="border-l-green-500"
      icon={<GFGIcon />}
      stats={statDefs}
    />
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-slate-300"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LeetCodeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-yellow-400"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

function GFGIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-5 h-5 text-green-400"
    >
      <path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-.608.177 4.45 4.45 0 0 1-.668.073h-.066v.006H5.56v-.006h-.067a4.45 4.45 0 0 1-.668-.073 4.51 4.51 0 0 1-.608-.177 3.691 3.691 0 0 1-1.104-.695 2.933 2.933 0 0 1-.565-.745A2.628 2.628 0 0 1 2.243 13c0-.414.091-.8.305-1.129.21-.322.48-.569.78-.756a3.573 3.573 0 0 1-.307-1.645 3.578 3.578 0 0 1 .535-1.847A3.564 3.564 0 0 1 4.807 6.41a3.57 3.57 0 0 1 1.944-.53 3.57 3.57 0 0 1 2.405.919 4.6 4.6 0 0 1 2.844-.998 4.6 4.6 0 0 1 2.844.998 3.57 3.57 0 0 1 2.405-.92 3.57 3.57 0 0 1 1.945.531 3.564 3.564 0 0 1 1.25 1.213 3.578 3.578 0 0 1 .535 1.847 3.573 3.573 0 0 1-.307 1.645c.3.187.57.434.78.756.214.33.305.715.305 1.13 0 .466-.105.897-.307 1.314z" />
    </svg>
  );
}
