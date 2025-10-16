import React, { useRef, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';

const NeuralNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[];

    const options = {
      particleColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
      lineColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      particleAmount: 50,
      defaultRadius: 2,
      variantRadius: 2,
      defaultSpeed: 1,
      variantSpeed: 1,
      linkRadius: 200,
    };

    class Particle {
      x: number;
      y: number;
      radius: number;
      speed: number;
      directionAngle: number;
      vector: { x: number; y: number };

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = options.defaultRadius + Math.random() * options.variantRadius;
        this.speed = options.defaultSpeed + Math.random() * options.variantSpeed;
        this.directionAngle = Math.floor(Math.random() * 360);
        this.vector = {
          x: Math.cos(this.directionAngle) * this.speed,
          y: Math.sin(this.directionAngle) * this.speed,
        };
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = options.particleColor;
        ctx.fill();
      }

      update() {
        this.border();
        this.x += this.vector.x;
        this.y += this.vector.y;
      }

      border() {
        if (this.x >= canvas.width || this.x <= 0) {
          this.vector.x *= -1;
        }
        if (this.y >= canvas.height || this.y <= 0) {
          this.vector.y *= -1;
        }
        if (this.x > canvas.width) this.x = canvas.width;
        if (this.y > canvas.height) this.y = canvas.height;
        if (this.x < 0) this.x = 0;
        if (this.y < 0) this.y = 0;
      }
    }

    const linkParticles = () => {
      if (!ctx) return;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = Math.sqrt(
            Math.pow(particles[i].x - particles[j].x, 2) +
            Math.pow(particles[i].y - particles[j].y, 2)
          );
          if (distance < options.linkRadius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.closePath();
            ctx.strokeStyle = options.lineColor;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    const setup = () => {
        particles = [];
        for (let i = 0; i < options.particleAmount; i++) {
          particles.push(new Particle());
        }
        window.requestAnimationFrame(loop);
      };

    const loop = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (particles) {
        particles.forEach((p) => {
          p.update();
          p.draw();
        });
        linkParticles();
      }
      animationFrameId = window.requestAnimationFrame(loop);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      setup();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
};

export default NeuralNetwork;