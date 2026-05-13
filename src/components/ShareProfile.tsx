import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, Copy, CheckCircle2, Link as LinkIcon } from "lucide-react";
import type { Usernames } from "../types";
import { cn } from "../utils/cn";

interface ShareProfileProps {
  usernames: Usernames;
}

export default function ShareProfile({ usernames }: ShareProfileProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Generate shareable URL
  const params = new URLSearchParams();
  if (usernames.github) params.append("gh", usernames.github);
  if (usernames.leetcode) params.append("lc", usernames.leetcode);
  if (usernames.gfg) params.append("gfg", usernames.gfg);

  const shareUrl = `${window.location.origin}/p?${params.toString()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm",
          "bg-gradient-to-r from-brand-500 to-brand-600 text-white",
          "hover:shadow-lg hover:shadow-brand-500/50 transition-all",
          "border border-brand-400/20"
        )}
      >
        <Share2 className="w-4 h-4" />
        Share Profile
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-96 z-50"
          >
            <div className="rounded-2xl bg-surface-800 border border-white/10 shadow-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <LinkIcon className="w-5 h-5 text-brand-400" />
                <h3 className="font-semibold text-white">Share Your Profile</h3>
              </div>

              <p className="text-sm text-slate-400">
                Share this link with recruiters and peers to showcase your developer metrics.
              </p>

              <div className="relative">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className={cn(
                    "w-full px-4 py-3 rounded-lg text-sm",
                    "bg-surface-900 border border-white/10",
                    "text-slate-300 font-mono",
                    "focus:outline-none focus:border-brand-500/50"
                  )}
                />
                <button
                  onClick={handleCopy}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg",
                    "transition-all duration-200",
                    copied
                      ? "bg-green-500/20 text-green-400"
                      : "bg-surface-700 text-slate-400 hover:text-white hover:bg-surface-600"
                  )}
                >
                  {copied ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {copied && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-green-400 font-medium"
                >
                  ✓ Link copied to clipboard!
                </motion.p>
              )}

              <div className="pt-4 border-t border-white/5 space-y-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Share on
                </p>
                <div className="flex gap-2">
                  <ShareButton
                    icon="𝕏"
                    label="Twitter"
                    onClick={() => {
                      const text = `Check out my developer metrics! ${shareUrl}`;
                      window.open(
                        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                        "_blank"
                      );
                    }}
                  />
                  <ShareButton
                    icon="in"
                    label="LinkedIn"
                    onClick={() => {
                      window.open(
                        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                        "_blank"
                      );
                    }}
                  />
                  <ShareButton
                    icon="📧"
                    label="Email"
                    onClick={() => {
                      const subject = "Check out my Developer Metrics";
                      const body = `I'd like to share my developer metrics with you:\n\n${shareUrl}`;
                      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShareButton({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg",
        "bg-surface-700 hover:bg-surface-600 transition-colors",
        "text-sm font-medium text-slate-300 hover:text-white"
      )}
      title={label}
    >
      <span>{icon}</span>
    </motion.button>
  );
}
