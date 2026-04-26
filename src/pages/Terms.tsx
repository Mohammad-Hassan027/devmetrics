export default function Terms() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-white mb-6 tracking-tight">
        Terms of Service
      </h1>
      <div className="glass-card p-8 space-y-6 text-slate-300 leading-relaxed">
        <p>
          <strong>Last Updated:</strong> April 2026
        </p>
        <p>
          By using DevMetrics, you agree to these Terms of Service. Please read
          them carefully.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">
          Acceptable Use
        </h2>
        <p>
          DevMetrics is provided as a free tool to visualize developer
          statistics. You agree not to abuse the service by attempting to
          circumvent rate limits maliciously or using the service to scrape
          third-party APIs through our frontend.
        </p>
        <h2 className="text-xl font-bold text-white mt-8 mb-4">
          Disclaimer of Warranties
        </h2>
        <p>
          The service is provided "as is". We make no warranties regarding the
          uptime or accuracy of the data presented, as it is wholly dependent on
          the availability and accuracy of public APIs from GitHub, LeetCode,
          and GeeksforGeeks.
        </p>
      </div>
    </div>
  );
}
