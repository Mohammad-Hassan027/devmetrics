import { motion } from "framer-motion";
import { Trophy, Medal, Zap } from "lucide-react";
import { cn } from "../utils/cn";

interface LeaderboardEntry {
  rank: number;
  name: string;
  username: string;
  score: number;
  github: number;
  leetcode: number;
  gfg: number;
  avatar?: string;
  badge?: string;
}

// Mock data - in a real app, this would come from a backend
const mockLeaderboard: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Alex Chen",
    username: "alexchen",
    score: 95,
    github: 35,
    leetcode: 35,
    gfg: 25,
    badge: "🚀 Rising Star",
  },
  {
    rank: 2,
    name: "Sarah Johnson",
    username: "sarahjohnson",
    score: 88,
    github: 32,
    leetcode: 30,
    gfg: 26,
    badge: "⭐ Top Contributor",
  },
  {
    rank: 3,
    name: "Mike Rodriguez",
    username: "mrodriguez",
    score: 82,
    github: 30,
    leetcode: 28,
    gfg: 24,
  },
  {
    rank: 4,
    name: "Emma Wilson",
    username: "emmawilson",
    score: 76,
    github: 28,
    leetcode: 25,
    gfg: 23,
  },
  {
    rank: 5,
    name: "James Liu",
    username: "jamesliu",
    score: 71,
    github: 26,
    leetcode: 22,
    gfg: 23,
  },
  {
    rank: 6,
    name: "Lisa Park",
    username: "lisapark",
    score: 68,
    github: 24,
    leetcode: 21,
    gfg: 23,
  },
  {
    rank: 7,
    name: "David Brown",
    username: "davidbrown",
    score: 65,
    github: 22,
    leetcode: 20,
    gfg: 23,
  },
  {
    rank: 8,
    name: "Sophie Martin",
    username: "sophiemartin",
    score: 62,
    github: 20,
    leetcode: 19,
    gfg: 23,
  },
];

export default function Leaderboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-medium text-amber-300">
            Global Rankings
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white">
          Developer Leaderboard
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          See where you rank among the top developers. Compete, improve, and showcase your skills.
        </p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        {mockLeaderboard.slice(0, 3).map((entry, idx) => (
          <PodiumCard key={entry.rank} entry={entry} position={idx} />
        ))}
      </motion.div>

      {/* Full Leaderboard Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl border border-white/10 overflow-hidden bg-surface-800/50 backdrop-blur-sm"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-surface-900/50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Developer
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Total Score
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  GitHub
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  LeetCode
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  GFG
                </th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry, idx) => (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.05 }}
                  className="border-b border-white/5 hover:bg-surface-700/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center">
                        {entry.rank <= 3 ? (
                          <Medal className={cn(
                            "w-5 h-5",
                            entry.rank === 1
                              ? "text-yellow-400"
                              : entry.rank === 2
                                ? "text-slate-300"
                                : "text-orange-400"
                          )} />
                        ) : (
                          <span className="text-sm font-bold text-slate-400">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{entry.name}</p>
                      <p className="text-sm text-slate-500">@{entry.username}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-white">{entry.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge value={entry.github} color="text-blue-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge value={entry.leetcode} color="text-yellow-400" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ScoreBadge value={entry.gfg} color="text-green-400" />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Info Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <InfoCard
          icon="📊"
          title="Score Calculation"
          description="Scores are calculated based on GitHub activity, LeetCode problems solved, and GeeksforGeeks contributions."
        />
        <InfoCard
          icon="🏆"
          title="Updated Weekly"
          description="Rankings are updated every week to reflect the latest developer metrics and contributions."
        />
        <InfoCard
          icon="🚀"
          title="Get Started"
          description="Create your profile and start climbing the leaderboard. Share your metrics with the community."
        />
      </motion.div>
    </div>
  );
}

function PodiumCard({
  entry,
  position,
}: {
  entry: LeaderboardEntry;
  position: number;
}) {
  const heights = ["h-48", "h-56", "h-40"];
  const bgColors = [
    "from-yellow-500/20 to-yellow-600/10",
    "from-slate-300/20 to-slate-400/10",
    "from-orange-500/20 to-orange-600/10",
  ];
  const borderColors = [
    "border-yellow-500/30",
    "border-slate-300/30",
    "border-orange-500/30",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: position * 0.1 }}
      className={cn(
        "rounded-2xl border backdrop-blur-sm p-6 flex flex-col items-center justify-end",
        `bg-gradient-to-b ${bgColors[position]}`,
        borderColors[position],
        heights[position]
      )}
    >
      <div className="text-center space-y-3 w-full">
        <div className="text-4xl font-bold text-white">{entry.score}</div>
        <div>
          <p className="font-bold text-white text-lg">{entry.name}</p>
          <p className="text-sm text-slate-400">@{entry.username}</p>
        </div>
        {entry.badge && (
          <div className="text-sm font-medium text-slate-300 pt-2">
            {entry.badge}
          </div>
        )}
        <div className="flex items-center justify-center gap-4 pt-4 text-xs">
          <span className="text-blue-400">GH: {entry.github}</span>
          <span className="text-yellow-400">LC: {entry.leetcode}</span>
          <span className="text-green-400">GFG: {entry.gfg}</span>
        </div>
      </div>
    </motion.div>
  );
}

function ScoreBadge({ value, color }: { value: number; color: string }) {
  return (
    <span className={cn("font-semibold", color)}>
      {value}
    </span>
  );
}

function InfoCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-2xl border border-white/10 bg-surface-800/50 p-6 space-y-3 hover:border-brand-500/30 transition-colors"
    >
      <div className="text-3xl">{icon}</div>
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}
