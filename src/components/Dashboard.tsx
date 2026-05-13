import type { Usernames, DevStats, FetchStatus } from "../types";
import { useDevMetrics } from "../context/DevMetricsContext";
import { useExportDashboard } from "../hooks/useExportDashboard";
import PlatformSection, { type StatDef } from "./PlatformSection";
import ChartsSection from "./charts/ChartsSection";
import DeveloperScoreCard from "./DeveloperScoreCard";
import RecruiterReadiness from "./RecruiterReadiness";
import InsightsPanel from "./InsightsPanel";
import ShareProfile from "./ShareProfile";
import { cn } from "../utils/cn";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Camera, CheckCircle2, RotateCcw } from "lucide-react";
import { useState } from "react";
import {
  FolderGit2,
  Star,
  Users,
  UserPlus,
  Code2,
  TerminalSquare,
  Award,
  Zap,
  BookOpen,
  Trophy,
  Flame,
  GraduationCap,
} from "lucide-react";

interface DashboardProps {
  usernames: Usernames | null;
  onReset: () => void;
}

export default function Dashboard({ usernames, onReset }: DashboardProps) {
  const localUsernames = usernames ?? { github: "", leetcode: "", gfg: "" };
  const { stats, isLoading, overallStatus } = useDevMetrics();
  const { exportRef, exportImage, exportState } = useExportDashboard(
    `devmetrics-${localUsernames.github || localUsernames.leetcode || "dashboard"}.png`,
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-12 w-full"
      ref={exportRef}
    >
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8 pb-4 border-b border-white/[0.03]">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Performance Insights
          </h2>
          <p className="text-slate-500 text-sm font-medium tracking-wide">
            {overallStatus === "loading" && "Synchronizing across platforms..."}
            {overallStatus === "success" && "All systems operational. Data is up to date."}
            {overallStatus === "partial" && "Partial sync completed. Some sources are unreachable."}
            {overallStatus === "error" &&
              "Synchronization failed. Please verify your credentials."}
            {overallStatus === "idle" &&
              "Aggregated intelligence from your connected technical footprints."}
          </p>
        </div>

        {/* Action buttons */}
        <div className="self-start sm:self-auto flex items-center gap-4">
          {localUsernames && localUsernames.github && (
            <ShareProfile usernames={localUsernames} />
          )}
          <button
            onClick={onReset}
            disabled={isLoading}
            className="flex items-center gap-2.5 bg-surface-800 border border-white/[0.03] hover:bg-surface-700
                       hover:text-white text-slate-400 text-[11px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-inner"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Update profiles
          </button>
          <button
            onClick={() => void exportImage()}
            disabled={exportState === "capturing" || isLoading}
            className="flex items-center gap-2.5 bg-brand-600 hover:bg-brand-500 text-white
                       text-[11px] font-bold uppercase tracking-widest px-6 py-3.5 rounded-2xl transition-all duration-300 shadow-xl shadow-brand-500/10"
          >
            {exportState === "capturing" ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </motion.div>
            ) : exportState === "done" ? (
              <CheckCircle2 className="w-3.5 h-3.5" />
            ) : (
              <Camera className="w-3.5 h-3.5" />
            )}
            {exportState === "done" ? "Report saved" : "Share report"}
          </button>
        </div>
      </div>

      {/* ── Profile chips ── */}
      <div className="flex flex-wrap gap-4">
        {localUsernames.github && (
          <ProfilePill
            platform="GitHub"
            username={localUsernames.github}
            status={stats.github.status}
          />
        )}
        {localUsernames.leetcode && (
          <ProfilePill
            platform="LeetCode"
            username={localUsernames.leetcode}
            status={stats.leetcode.status}
          />
        )}
        {localUsernames.gfg && (
          <ProfilePill
            platform="GFG"
            username={localUsernames.gfg}
            status={stats.gfg.status}
          />
        )}
      </div>

      <motion.div
        layout
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-12 gap-12"
      >
        {/* ── Developer Score Card (Full Width Bento) ── */}
        <motion.div
          variants={{
            hidden: { opacity: 0, scale: 0.98 },
            visible: { opacity: 1, scale: 1 },
          }}
          className="col-span-1 md:col-span-12"
        >
          <DeveloperScoreCard />
        </motion.div>

        {/* ── Platform sections (Grid items) ── */}
        <AnimatePresence mode="popLayout">
          {localUsernames.github && (
            <motion.div
              layout
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              key="github-section"
              className="col-span-1 md:col-span-12 lg:col-span-8 xl:col-span-8"
            >
              <GitHubSection stats={stats} />
            </motion.div>
          )}
          {localUsernames.leetcode && (
            <motion.div
              layout
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              key="leetcode-section"
              className="col-span-1 md:col-span-6 lg:col-span-4 xl:col-span-4"
            >
              <LeetCodeSection stats={stats} />
            </motion.div>
          )}
          {localUsernames.gfg && (
            <motion.div
              layout
              variants={{
                hidden: { opacity: 0, scale: 0.95 },
                visible: { opacity: 1, scale: 1 },
              }}
              key="gfg-section"
              className="col-span-1 md:col-span-6 lg:col-span-12 xl:col-span-12"
            >
              <GFGSection stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Recruiter Readiness Score ── */}
      <RecruiterReadiness stats={stats} isLoading={isLoading} />

      {/* ── Charts ── */}
      <div className="mt-8">
        <ChartsSection stats={stats} />
      </div>

      {/* ── Insights Panel ── */}
      <InsightsPanel stats={stats} isLoading={isLoading} />
    </motion.div>
  );
}

function ProfilePill({
  platform,
  username,
  status,
}: {
  platform: string;
  username: string;
  status: FetchStatus;
}) {
  const [copied, setCopied] = useState(false);

  const dot =
    status === "loading"
      ? "bg-[#f59e0b] animate-pulse shadow-[0_0_8px_#f59e0b66]"
      : status === "success"
        ? "bg-[#10b981] shadow-[0_0_8px_#10b98166]"
        : status === "error"
          ? "bg-[#ef4444] shadow-[0_0_8px_#ef444466]"
          : "bg-slate-600";

  const handleCopy = () => {
    navigator.clipboard.writeText(username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm font-medium border border-white/5 bg-surface-800 shadow-inner">
      <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dot)} />
      <span className="text-slate-300">{platform}</span>
      <span className="text-slate-600">/</span>
      <span className="text-white font-mono">@{username}</span>
      <button
        onClick={handleCopy}
        className="ml-1 p-1 rounded-md text-slate-500 hover:text-white hover:bg-surface-600 transition-colors"
        title="Copy identifier"
      >
        {copied ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
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
      icon: <FolderGit2 className="w-5 h-5" />,
      badge: "Repositories",
    },
    {
      label: "Total Stars",
      value: data?.total_stars ?? null,
      icon: <Star className="w-5 h-5" />,
      badge: "Stars Earned",
    },
    {
      label: "Followers",
      value: data?.followers ?? null,
      icon: <Users className="w-5 h-5" />,
      badge: "Community",
    },
    {
      label: "Following",
      value: data?.following ?? null,
      icon: <UserPlus className="w-5 h-5" />,
      badge: "Following",
    },
  ];
  return (
    <PlatformSection
      id="section-github"
      title="GitHub"
      username={data?.login ?? ""}
      status={status}
      error={error}
      avatar={data?.avatar_url}
      profileUrl={data?.html_url}
      bio={data?.bio ?? undefined}
      accentColor="border-l-blue-500"
      icon={
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
        </svg>
      }
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
      icon: <Code2 className="w-5 h-5" />,
      badge: "Total",
    },
    {
      label: "Easy",
      value: data?.easySolved ?? null,
      icon: <TerminalSquare className="w-5 h-5 text-green-400" />,
      badge: "Easy",
    },
    {
      label: "Medium",
      value: data?.mediumSolved ?? null,
      icon: <TerminalSquare className="w-5 h-5 text-yellow-400" />,
      badge: "Medium",
    },
    {
      label: "Hard",
      value: data?.hardSolved ?? null,
      icon: <TerminalSquare className="w-5 h-5 text-red-500" />,
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
      icon={<Award className="w-6 h-6 text-yellow-500" />}
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
      icon: <BookOpen className="w-5 h-5" />,
      badge: "Total",
    },
    {
      label: "Coding Score",
      value: data?.codingScore ?? null,
      icon: <Trophy className="w-5 h-5" />,
      badge: "Score",
    },
    {
      label: "Current Streak",
      value: data?.currentStreak ?? null,
      icon: <Flame className="w-5 h-5" />,
      badge: "Days",
    },
    {
      label: "Institute Rank",
      value: data?.instituteRank ?? null,
      icon: <GraduationCap className="w-5 h-5" />,
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
      icon={<Zap className="w-6 h-6 text-green-500" />}
      stats={statDefs}
    />
  );
}
