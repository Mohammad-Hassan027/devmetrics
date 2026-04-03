export default function Features() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto text-center">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">Features</h1>
      <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
        Everything you need to showcase your coding journey in one beautiful, shareable dashboard.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        <div className="glass-card p-6 group">
          <div className="w-12 h-12 bg-surface-900 border border-white/10 text-slate-300 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors duration-300 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">🔗</div>
          <h3 className="text-xl font-bold text-white mb-2">Unified Profiles</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Combine your GitHub, LeetCode, and GeeksforGeeks stats into a single source of truth.</p>
        </div>
        <div className="glass-card p-6 group">
          <div className="w-12 h-12 bg-surface-900 border border-white/10 text-slate-300 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors duration-300 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">🏆</div>
          <h3 className="text-xl font-bold text-white mb-2">Global Scoring</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Our proprietary engine calculates your rank, giving you a custom badge to show off to recruiters.</p>
        </div>
        <div className="glass-card p-6 group">
          <div className="w-12 h-12 bg-surface-900 border border-white/10 text-slate-300 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors duration-300 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">📊</div>
          <h3 className="text-xl font-bold text-white mb-2">Beautiful Analytics</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Responsive charts using Recharts visualize your problem-solving distribution across all platforms.</p>
        </div>
        <div className="glass-card p-6 group">
          <div className="w-12 h-12 bg-surface-900 border border-white/10 text-slate-300 group-hover:text-brand-500 group-hover:border-brand-500/30 transition-colors duration-300 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm">📸</div>
          <h3 className="text-xl font-bold text-white mb-2">One-Click Export</h3>
          <p className="text-slate-400 text-sm leading-relaxed">Capture your entire dashboard as a high-res retina PNG instantly.</p>
        </div>
      </div>
    </div>
  );
}
