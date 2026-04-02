export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 bg-background">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(220 10% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(220 10% 50%) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
