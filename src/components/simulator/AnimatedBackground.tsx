export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, hsl(228 30% 14%) 0%, hsl(228 30% 8%) 100%)",
        }}
      />
      {/* Accent orb - top right */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[600px] h-[600px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, hsl(199 89% 48% / 0.06) 0%, transparent 70%)",
        }}
      />
      {/* Accent orb - bottom left */}
      <div
        className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full animate-glow-pulse"
        style={{
          background: "radial-gradient(circle, hsl(270 60% 58% / 0.05) 0%, transparent 70%)",
          animationDelay: "1.5s",
        }}
      />
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(hsl(199 89% 60%) 1px, transparent 1px), linear-gradient(90deg, hsl(199 89% 60%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
    </div>
  );
}
