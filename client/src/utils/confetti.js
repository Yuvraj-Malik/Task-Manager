import confetti from "canvas-confetti";

export const triggerTaskCompletionConfetti = () => {
  // Fire a celebratory twin confetti burst
  confetti({
    particleCount: 40,
    spread: 60,
    origin: { y: 0.85, x: 0.5 },
    colors: ["#6366f1", "#10b981", "#38bdf8", "#ec4899", "#f59e0b"],
  });

  setTimeout(() => {
    confetti({
      particleCount: 25,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#6366f1", "#10b981", "#38bdf8"],
    });
    confetti({
      particleCount: 25,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#ec4899", "#f59e0b", "#8b5cf6"],
    });
  }, 150);
};
