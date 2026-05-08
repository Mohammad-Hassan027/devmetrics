import { useAuth } from "../context/AuthContext";

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

  return (
    <div className="w-full max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Question Tracker</h1>
        <div className="text-sm text-slate-400">Signed in as {user.email}</div>
      </header>

      <main className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="p-4 rounded lg:col-span-1 bg-white/3">Filters</aside>
        <section className="p-4 rounded lg:col-span-3 bg-white/5">
          Problem list & editor
        </section>
      </main>
    </div>
  );
}
