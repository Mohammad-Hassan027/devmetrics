import { Link, Trophy, BarChart3, Camera } from "lucide-react";

export default function Features() {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto text-center px-6">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
        Capabilities
      </h1>
      <p className="text-slate-500 text-lg mb-16 max-w-2xl mx-auto font-medium">
        A sophisticated toolkit designed to baseline and showcase your technical
        development footprint.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <CapabilityCard
          icon={<Link className="w-6 h-6" strokeWidth={1.5} />}
          title="Source Aggregation"
          description="Consolidate your technical footprint from GitHub, LeetCode, and GFG into a single source of truth."
        />
        <CapabilityCard
          icon={<Trophy className="w-6 h-6" strokeWidth={1.5} />}
          title="Reputation Engine"
          description="Our proprietary algorithm benchmarks your proficiency, assigning a verified tier based on real-world impact."
        />
        <CapabilityCard
          icon={<BarChart3 className="w-6 h-6" strokeWidth={1.5} />}
          title="Deep Insights"
          description="Visualize problem-solving trajectories and repository health with high-fidelity distributed charts."
        />
        <CapabilityCard
          icon={<Camera className="w-6 h-6" strokeWidth={1.5} />}
          title="Retina Assets"
          description="Generate high-resolution report cards optimized for technical portfolios and professional networks."
        />
      </div>
    </div>
  );
}

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass-card p-10 group relative overflow-hidden flex flex-col items-start gap-6">
      <div className="p-4 rounded-2xl bg-surface-900 border border-white/[0.03] text-slate-400 group-hover:text-brand-400 group-hover:border-brand-500/20 transition-all duration-500 shadow-inner">
        {icon}
      </div>
      <div className="space-y-3">
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );
}
