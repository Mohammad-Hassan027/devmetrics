export default function About() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">About DevMetrics</h1>
      <div className="glass-card p-8 space-y-6 text-slate-300 leading-relaxed">
        <p>
          DevMetrics was built by developers, for developers, to provide a single, unified view of your coding accomplishments across the web.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Our Mission</h2>
        <p>
          We believe that a developer's track record shouldn't be siloed across different platforms. By aggregating data from GitHub, LeetCode, and GeeksforGeeks, we aim to give you a comprehensive snapshot of your coding habits, problem-solving skills, and open-source contributions.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">The Developer Score Engine</h2>
        <p>
          Our custom scoring algorithm weights different types of contributions to assign you a global Developer Score. It takes into account active streaks, coding difficulties, repository popularity, and more, granting a fun, gamified badge that you can show off.
        </p>
      </div>
    </div>
  );
}
