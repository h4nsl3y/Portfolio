import React, { useRef, useEffect } from "react";

interface CircularParticlesProps {
  radiusFactor: number; // 0 to 1
}

const CircularParticles: React.FC<CircularParticlesProps> = ({ radiusFactor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    const particleCount = 300;

    const minRadius = 2;
    const maxRadius = Math.min(width, height) / 2;
    const scale = 2;  // steepness
    const shift = 0.5; // center at radiusFactor=0.5
    const radius = ((Math.tanh(scale * (radiusFactor - shift)) + 1) / 2) * (maxRadius - minRadius) + minRadius;

    console.log(` radiusFactor = ${radiusFactor}, radius = ${radius}`);
    // Map radiusFactor to speed & entropy
    const maxSpeed = 2;
    const minSpeed = 0.002;
    const speedScale = 2;   // controls steepness
    const speedShift = 0.5; // center at radiusFactor=0.5
    const speedFactor = ((Math.tanh(speedScale * (1 - radiusFactor - speedShift)) + 1) / 2) * (maxSpeed - minSpeed) + minSpeed;

    const minEntropy = 0.05;  // almost no randomness
    const maxEntropy = 0.5;   // very chaotic

    let entropy ;
    if (radiusFactor < 0.3) {
        // below 0.4 → full chaotic
        entropy = maxEntropy;
    } else if (radiusFactor >= 0.3 && radiusFactor <= 0.7) {
        // smooth decay between 0.4 → 0.9
        const t = (0.7 - radiusFactor) / (0.7 - 0.3); // normalized 1 → 0
        entropy = minEntropy + (maxEntropy - minEntropy) * t; 
    } else {
        // above 0.9 → stable
        entropy = minEntropy;
    }
    
    

    // Initialize particles
    const particles = Array.from({ length: particleCount }, () => ({
        angle: Math.random() * Math.PI * 2,
        speed: speedFactor + Math.random() * speedFactor * entropy, // slightly randomize speed
        color: "rgba(255, 255, 255, 1)",
        size: 1 + Math.random() * 2,
        radiusOffset: radiusFactor < 0.4 ? (Math.random() - 0.5) * 1.5 * radius : (Math.random() - 0.5) * 2 * radius * entropy
    }));

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        // Update angle
        p.angle += p.speed;

        // Apply entropy to radius
        const r = radius + p.radiusOffset;

        const x = centerX + Math.cos(p.angle) * r;
        const y = centerY + Math.sin(p.angle) * r;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [radiusFactor]);

  return (
    <div className="h-full w-full flex items-center justify-center">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};

export default CircularParticles;
