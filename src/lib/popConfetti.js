import confetti from 'canvas-confetti';

/** Ekran koordinatına (0-1 aralığı) küçük, marka renkli konfeti patlaması. */
export default function popConfetti(x = 0.5, y = 0.5) {
  confetti({
    particleCount: 55,
    spread: 60,
    startVelocity: 26,
    scalar: 0.85,
    ticks: 130,
    origin: { x, y },
    colors: ['#3ce8a4', '#ffb302', '#ff7a52', '#16213a'],
  });
}