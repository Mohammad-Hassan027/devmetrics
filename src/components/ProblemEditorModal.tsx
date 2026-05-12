import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ProblemEntry } from "../types";

interface ProblemEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: Omit<ProblemEntry, "id" | "user_id" | "created_at" | "updated_at">) => Promise<void>;
  initialData?: ProblemEntry | null;
}

const PLATFORMS = ["LeetCode", "GeeksforGeeks", "Codeforces", "HackerRank", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];

export default function ProblemEditorModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: ProblemEditorModalProps) {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [solvedAt, setSolvedAt] = useState(new Date().toISOString().split("T")[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setPlatform(initialData.platform);
        setTitle(initialData.title);
        setUrl(initialData.url || "");
        setDifficulty(initialData.difficulty || DIFFICULTIES[0]);
        // Handle potentially invalid dates from initialData gracefully
        try {
          const dateStr = initialData.solved_at ? new Date(initialData.solved_at).toISOString().split("T")[0] : new Date().toISOString().split("T")[0];
          setSolvedAt(dateStr);
        } catch {
          setSolvedAt(new Date().toISOString().split("T")[0]);
        }
        setTagsInput(initialData.tags.join(", "));
        setNotes(initialData.notes || "");
      } else {
        setPlatform(PLATFORMS[0]);
        setTitle("");
        setUrl("");
        setDifficulty(DIFFICULTIES[0]);
        setSolvedAt(new Date().toISOString().split("T")[0]);
        setTagsInput("");
        setNotes("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    
    // Parse tags safely, ensuring no empty tags are added
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSave({
        platform,
        title: title.trim(),
        url: url.trim() || undefined,
        difficulty,
        solved_at: new Date(solvedAt).toISOString(),
        tags,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to save problem:", error);
      // In a real app we'd show a toast error here
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-md rounded-lg bg-surface-800 border border-white/10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                {initialData ? "Edit Problem" : "Add New Problem"}
              </h2>
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  required
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p} className="bg-surface-800">
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Problem Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="e.g. Two Sum"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  URL (Optional)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d} className="bg-surface-800">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">
                    Date Solved
                  </label>
                  <input
                    type="date"
                    value={solvedAt}
                    onChange={(e) => setSolvedAt(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                  placeholder="arrays, hash map, two pointers"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 min-h-[100px] resize-none"
                  placeholder="Key takeaways, time complexity, space complexity..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting || !title.trim()}
                >
                  {isSubmitting ? "Saving..." : "Save Problem"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
