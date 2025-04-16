import React, { useEffect, useRef } from "react";
import "../Styles/AnimatedBg.css"; // External CSS for styling

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set the canvas dimensions.
    // Width: full viewport width.
    // Height: 400vh (4x the viewport height)
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 5.29; // 400vh
    };

    setCanvasSize();

    const mouse = { x: null, y: null, radius: 12 };
    const params = {
      numDots: 350,
      maxSpeed: 2.0,
      dotRadius: 3.5,
      connectDistance: 250,
      randomness: 0.3,
    };
    let dots = [];

    // Update canvas size on window resize
    const handleResize = () => {
      setCanvasSize();
      initDots();
    };
    window.addEventListener("resize", handleResize);

    // Update mouse coordinates on move
    const handleMouseMove = (event) => {
      mouse.x = event.x;
      mouse.y = event.y;
    };
    window.addEventListener("mousemove", handleMouseMove);

    class Dot {
      constructor(x, y, dx, dy, radius) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.radius = radius;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "#fff";
        ctx.fill();
      }

      update() {
        // Bounce off the canvas edges
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
          this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
          this.dy = -this.dy;
        }

        // Interaction with the mouse pointer
        if (mouse.x && mouse.y) {
          const dxMouse = this.x - mouse.x;
          const dyMouse = this.y - mouse.y;
          const distance = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          if (distance < mouse.radius + this.radius) {
            const angle = Math.atan2(dyMouse, dxMouse);
            const force = (mouse.radius + this.radius - distance) / (mouse.radius + this.radius);
            this.dx += Math.cos(angle) * force;
            this.dy += Math.sin(angle) * force;
          }
        }

        // Add some randomness to the movement
        this.dx += (Math.random() - 0.5) * params.randomness;
        this.dy += (Math.random() - 0.5) * params.randomness;

        // Apply friction
        this.dx *= 0.98;
        this.dy *= 0.98;

        // Update position
        this.x += this.dx;
        this.y += this.dy;

        this.draw();
      }
    }

    // Helper function to calculate distance between two points
    function distanceBetween(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }

    // Create initial dots
    function initDots() {
      dots = [];
      for (let i = 0; i < params.numDots; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        const dx = (Math.random() - 0.5) * params.maxSpeed;
        const dy = (Math.random() - 0.5) * params.maxSpeed;
        dots.push(new Dot(x, y, dx, dy, params.dotRadius));
      }
    }

    // Draw lines connecting close dots
    function connectDots() {
      for (let a = 0; a < dots.length; a++) {
        for (let b = a + 1; b < dots.length; b++) {
          const distance = distanceBetween(dots[a].x, dots[a].y, dots[b].x, dots[b].y);
          if (distance < params.connectDistance) {
            ctx.beginPath();
            ctx.moveTo(dots[a].x, dots[a].y);
            ctx.lineTo(dots[b].x, dots[b].y);
            ctx.strokeStyle = "rgba(255, 255, 255, " + (1 - distance / params.connectDistance) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    }

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);
      // A semi-transparent fill helps create a trailing effect
      ctx.fillStyle = "rgba(17, 17, 17, 0.8)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      dots.forEach((dot) => dot.update());
      connectDots();
    }

    initDots();
    animate();

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} className="animated-background"></canvas>
    </div>
  );
};

export default AnimatedBackground;
