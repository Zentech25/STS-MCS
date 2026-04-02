export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-background" />
      {/* Subtle gradient accent */}
      <div
        className="absolute -top-[30%] -right-[15%] w-[700px] h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.06) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-[30%] -left-[15%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 60% / 0.04) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
