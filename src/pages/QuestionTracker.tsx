import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Plus, Search, Filter, Trash2, Loader2, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { ProblemEntry } from "../types";
import { problemsService } from "../services/problems";
import ProblemEditorModal from "../components/ProblemEditorModal";

/*
Component structure proposal for Question Tracker page (to implement):

- QuestionTrackerPage (page)
  - TrackerHeader (title, quick-stats, new-entry button)
  - ProblemList (list of ProblemCard)
    - ProblemCard (platform, title, difficulty, solvedAt, tags, notes preview)
  - ProblemEditorModal (add/edit problem entry with notes, tags, source link)
  - FiltersSidebar (platform filters, tags, search)
  - Persist layer: use SDK (Supabase/Firebase) to store entries under user ID

Data model (example)
type ProblemEntry = {
  id: string;
  userId: string;
  platform: "leetcode" | "gfg" | "codeforces" | string;
  platformId?: string; // original platform id or url
  title: string;
  url?: string;
  difficulty?: string;
  solvedAt: string; // ISO
  tags: string[];
  notes?: string;
};

Persistence notes:
- Create a `problems` table/collection with a foreign key to users.
- Index by `userId`, `tags`, `platform` and `solvedAt` for queries.
- Use server-side checks to verify ownership when importing from external platforms.

The file below is a lightweight scaffold to get started with the UI and wiring.
*/

export default function QuestionTrackerPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<ProblemEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  useEffect(() => {
    async function loadProblems() {
      if (!user) {
        setProblems([]);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        const data = await problemsService.getProblems(user.id);
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadProblems();
  }, [user]);

  const handleSaveProblem = async (problemData: Omit<ProblemEntry, "id" | "user_id" | "created_at" | "updated_at">) => {
    if (!user) return;
    try {
      if (editingProblem) {
        const updated = await problemsService.updateProblem(editingProblem.id, problemData);
        setProblems((prev) => prev.map((p) => p.id === editingProblem.id ? { ...p, ...updated } : p));
      } else {
        const newProblem = await problemsService.addProblem({
          ...problemData,
          user_id: user.id
        } as any);
        setProblems((prev) => [newProblem, ...prev]);
      }
    } catch (error) {
      console.error("Failed to save problem:", error);
      throw error;
    }
  };

  const handleOpenEdit = (problem: ProblemEntry) => {
    setEditingProblem(problem);
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingProblem(null);
    setIsModalOpen(true);
  };

  const handleDeleteProblem = async (id: string) => {
    try {
      await problemsService.deleteProblem(id);
      setProblems((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete problem:", error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-3xl py-20 mx-auto text-center">
        <h2 className="mb-4 text-2xl font-semibold text-white">
          Question Tracker
        </h2>
        <p className="text-slate-400">Sign in to persist your question logs.</p>
      </div>
    );
  }

  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesPlatform =
      !selectedPlatform || p.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  const platforms = Array.from(new Set(problems.map((p) => p.platform)));

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col justify-between gap-4 mb-6 sm:flex-row sm:items-center"
      >
        <div>
          <h1 className="text-3xl font-semibold text-white">
            Question Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and organize problems you've solved across platforms
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition-colors duration-200 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Add Problem
        </button>
      </motion.header>

      {/* Stats */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
        </div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 gap-3 mb-6 sm:grid-cols-3"
          >
            <div className="p-4 rounded-lg bg-white/3 border border-white/5">
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Total Problems
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {problems.length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/3 border border-white/5">
              <p className="text-xs font-semibold text-slate-400 uppercase">
                Platforms
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {platforms.length}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-white/3 border border-white/5">
              <p className="text-xs font-semibold text-slate-400 uppercase">
                This Week
              </p>
              <p className="mt-2 text-2xl font-bold text-white">
                {
                  problems.filter((p) => {
                    const date = new Date(p.solved_at);
                    const weekAgo = new Date();
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return date >= weekAgo;
                  }).length
                }
              </p>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6 lg:grid-cols-4"
          >
            {/* Filters Sidebar */}
            <aside className="p-4 rounded-lg lg:col-span-1 bg-white/3 border border-white/5 h-fit">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-slate-400" />
                <h2 className="text-sm font-semibold text-white">Filters</h2>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => setSelectedPlatform(null)}
                  className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200 ${selectedPlatform === null
                      ? "bg-brand-500/20 text-brand-300"
                      : "text-slate-300 hover:bg-white/5"
                    }`}
                >
                  All Platforms
                </button>
                {platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200 ${selectedPlatform === platform
                        ? "bg-brand-500/20 text-brand-300"
                        : "text-slate-300 hover:bg-white/5"
                      }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </aside>

            {/* Problems List */}
            <section className="lg:col-span-3">
              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search problems or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/3 border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 transition-all duration-200"
                />
              </div>

              {/* Problems Grid */}
              {filteredProblems.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-slate-400">
                    {problems.length === 0
                      ? "No problems yet. Start by adding your first problem!"
                      : "No problems match your filters."}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredProblems.map((problem, idx) => (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-4 rounded-lg bg-white/3 border border-white/5 hover:border-white/10 hover:bg-white/4 transition-all duration-200 group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold text-brand-400 uppercase">
                              {problem.platform}
                            </span>
                            {problem.difficulty && (
                              <span
                                className={`text-xs font-semibold px-2 py-0.5 rounded ${problem.difficulty === "Easy"
                                    ? "bg-green-500/20 text-green-300"
                                    : problem.difficulty === "Medium"
                                      ? "bg-yellow-500/20 text-yellow-300"
                                      : "bg-red-500/20 text-red-300"
                                  }`}
                              >
                                {problem.difficulty}
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-white truncate flex items-center gap-2">
                            {problem.title}
                            {problem.url && (
                              <a
                                href={problem.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-brand-400 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </h3>
                          {problem.notes && (
                            <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                              {problem.notes}
                            </p>
                          )}
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {problem.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 whitespace-nowrap">
                            {new Date(problem.solved_at).toLocaleDateString()}
                          </span>
                          <button
                            onClick={() => handleOpenEdit(problem)}
                            className="p-1.5 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-400 hover:bg-brand-500/10 transition-all duration-200"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                          </button>
                          <button
                            onClick={() => handleDeleteProblem(problem.id)}
                            className="p-1.5 rounded opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>
          </motion.div>
        </>
      )}

      <ProblemEditorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProblem}
        initialData={editingProblem}
      />
    </div>
  );
}
