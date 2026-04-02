export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Soft gradient base */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(135deg, hsl(220 30% 96%) 0%, hsl(220 20% 94%) 40%, hsl(230 25% 95%) 100%)",
      }} />
      {/* Floating orbs (macOS-style ambient) */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full animate-float" style={{
        background: "radial-gradient(circle, hsl(217 91% 60% / 0.08) 0%, transparent 70%)",
      }} />
      <div className="absolute bottom-[-25%] left-[-10%] w-[500px] h-[500px] rounded-full animate-float" style={{
        background: "radial-gradient(circle, hsl(280 60% 65% / 0.06) 0%, transparent 70%)",
        animationDelay: "3s",
      }} />
      <div className="absolute top-[30%] left-[50%] w-[400px] h-[400px] rounded-full animate-float" style={{
        background: "radial-gradient(circle, hsl(340 70% 65% / 0.04) 0%, transparent 70%)",
        animationDelay: "1.5s",
      }} />
    </div>
  );
}
