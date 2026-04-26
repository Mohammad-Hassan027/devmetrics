export default function Privacy() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
        Privacy Policy
      </h1>
      <div className="glass-card p-8 space-y-6 text-slate-300 leading-relaxed">
        <p>
          <strong>Last Updated:</strong> April 2026
        </p>
        <p>
          At DevMetrics, we take your privacy seriously. This privacy policy
          explains how we handle the data you input into our application.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">
          Data Collection
        </h2>
        <p>
          DevMetrics is a client-side aggregation tool. When you input your
          usernames for GitHub, LeetCode, or GeeksforGeeks, your browser makes
          direct requests to those respective public API endpoints.
        </p>
        <p>
          We do <strong>not</strong> store your usernames, we do{" "}
          <strong>not</strong> track your usage, and we do <strong>not</strong>{" "}
          possess a backend database hoarding your statistics. All processing
          happens locally in your browser.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">
          Third-Party Services
        </h2>
        <p>
          Because we rely on public APIs from GitHub, LeetCode, and GFG, your IP
          address may be exposed to those services when your browser fetches
          your stats. Please refer to their respective privacy policies for more
          information.
        </p>
      </div>
    </div>
  );
}
