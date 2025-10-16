import React, { useRef, useEffect } from 'react';

const NeuralNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Node {
      x: number;
      y: number;
      radius: number;
      dx: number;
      dy: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 3 + 1;
        this.dx = Math.random() * 2 - 1;
        this.dy = Math.random() * 2 - 1;
      }

      update() {
        this.x += this.dx;
        this.y += this.dy;

        if (this.x < 0 || this.x > canvas!.width) this.dx *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.dy *= -1;
      }

      draw() {
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx!.fill();
      }
    }

    class Connection {
      node1: Node;
      node2: Node;

      constructor(node1: Node, node2: Node) {
        this.node1 = node1;
        this.node2 = node2;
      }

      draw() {
        const distance = Math.hypot(this.node1.x - this.node2.x, this.node1.y - this.node2.y);
        if (distance < 100) {
          ctx!.beginPath();
          ctx!.moveTo(this.node1.x, this.node1.y);
          ctx!.lineTo(this.node2.x, this.node2.y);
          ctx!.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`;
          ctx!.stroke();
        }
      }
    }

    const nodes: Node[] = [];
    const connections: Connection[] = [];
    const nodeCount = 100;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new Node(Math.random() * canvas.width, Math.random() * canvas.height));
    }

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        connections.push(new Connection(nodes[i], nodes[j]));
      }
    }

    let animationFrameId: number;
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);

      connections.forEach(connection => connection.draw());
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        background: '#000',
      }}
    />
  );
};

export default NeuralNetworkCanvas;