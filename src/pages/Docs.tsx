export default function Docs() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Documentation</h1>
      <div className="glass-card p-8 space-y-6 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white mb-4">How Scoring Works</h2>
        <p>
          Your developer score is calculated using a weighted algorithm across your linked platforms:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>GitHub:</strong> Points for public repos, total stars earned across all repos, and follower count. We weight stars most heavily.</li>
          <li><strong>LeetCode:</strong> Heavy emphasis on Hard and Medium problems solved, with a small bonus for a high global acceptance rate.</li>
          <li><strong>GeeksforGeeks:</strong> Points allocated based on cumulative coding score, max streaks, and total problems cleared.</li>
        </ul>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Exporting your Dashboard</h2>
        <p>
          You can save your dashboard anytime by clicking the <code>Export PNG</code> button. We use a high-quality (2x retina) canvas capture that temporarily freezes animations to ensure a clean, crisp output suitable for sharing on LinkedIn or Twitter.
        </p>
      </div>
    </div>
  );
}
