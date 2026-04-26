export default function About() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
        The Mission
      </h1>
      <div className="glass-card p-8 space-y-6 text-slate-300 leading-relaxed">
        <p>
          DevMetrics was architected by engineers to provide a unified,
          high-fidelity visualization of technical accomplishments across the
          global development ecosystem.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">Objective</h2>
        <p>
          Technical reputation shouldn't be siloed. By aggregating data from
          GitHub, LeetCode, and GeeksforGeeks, we provide a comprehensive
          baseline of engineering output, problem-solving proficiency, and
          open-source impact.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">
          Reputation Benchmarking
        </h2>
        <p>
          Our proprietary engine weights diverse technical signals to assign a
          verified tier. We baseline active streaks, problem-solving complexity,
          and repository health to grant a professional distinction that
          reflects true technical reach.
        </p>
      </div>
    </div>
  );
}
