import React, { useEffect, useRef } from 'react';

const HeroParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particlesArray: Particle[] = [];
        let animationFrameId: number;
        let isDarkMode = document.documentElement.classList.contains('dark');

        // Helper to check theme
        const updateTheme = () => {
            isDarkMode = document.documentElement.classList.contains('dark');
            initParticles(); // Reinitialize particles with new colors
        };

        // MutationObserver to watch class changes on html
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    updateTheme();
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });

        // Resize handler
        const resizeCanvas = () => {
            if (!canvas.parentElement) return;
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            initParticles();
        };
        window.addEventListener('resize', resizeCanvas);
        
        // Initial sizing
        if (canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        // Particle Class
        class Particle {
            x: number;
            y: number;
            directionX: number;
            directionY: number;
            size: number;
            color: string;
            opacity: number;

            constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string, opacity: number) {
                this.x = x;
                this.y = y;
                this.directionX = directionX;
                this.directionY = directionY;
                this.size = size;
                this.color = color;
                this.opacity = opacity;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                
                // Parse color to apply opacity
                // Expected color format: rgb/rgba strings or hex. Our spec gives rgba strings, but parsing them manually can be tricky.
                // Since our spec gives rgba directly, we can just replace the alpha channel or rely on globalAlpha.
                // We'll use globalAlpha for simplicity.
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.fill();
                ctx.globalAlpha = 1.0; // Reset
            }

            update() {
                if (!canvas) return;
                // Move particle
                this.x += this.directionX;
                this.y += this.directionY;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                this.draw();
            }
        }

        // Create particles array
        const initParticles = () => {
            particlesArray = [];
            const isMobile = window.innerWidth < 768;
            const numberOfParticles = isMobile ? 28 : 55;

            // Palette
            const darkPalette = [
                'rgba(74, 222, 128, 1)',  // green 0.5 effectively via globalAlpha
                'rgba(252, 211, 77, 1)',  // gold 0.4
                'rgba(148, 163, 184, 1)'  // slate 0.3
            ];
            const lightPalette = [
                'rgba(22, 163, 74, 1)',   // green 0.4
                'rgba(217, 119, 6, 1)',   // amber 0.35
                'rgba(100, 116, 139, 1)'  // slate 0.25
            ];

            const currentPalette = isDarkMode ? darkPalette : lightPalette;

            for (let i = 0; i < numberOfParticles; i++) {
                const size = Math.random() * 1.5 + 1; // 1 to 2.5
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                
                const directionX = (Math.random() * 0.6) - 0.3; // ±0.3
                const directionY = (Math.random() * 0.6) - 0.3; // ±0.3
                
                const color = currentPalette[Math.floor(Math.random() * currentPalette.length)];
                
                // Specific opacities based on color is tricky if we randomize, let's assign a random base opacity
                const opacity = Math.random() * 0.5 + 0.3; // 0.3 to 0.8

                particlesArray.push(new Particle(x, y, directionX, directionY, size, color, opacity));
            }
        };

        // Connect nearby particles
        const connect = () => {
            if (!canvas || !ctx || window.innerWidth < 768) return; // Disable connections on mobile
            
            const maxDistance = 120;
            
            for (let a = 0; a < particlesArray.length; a++) {
                for (let b = a; b < particlesArray.length; b++) {
                    const dx = particlesArray[a].x - particlesArray[b].x;
                    const dy = particlesArray[a].y - particlesArray[b].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < maxDistance) {
                        // Calculate opacity based on distance (closer = more opaque, up to 0.15 max)
                        const opacityValue = 0.15 * (1 - (distance / maxDistance));
                        ctx.globalAlpha = opacityValue;
                        
                        // Use particle 'a's color for the line
                        ctx.strokeStyle = particlesArray[a].color;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
            ctx.globalAlpha = 1.0;
        };

        // Animation loop
        const animate = () => {
            if (!canvas || !ctx) return;
            animationFrameId = requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
            }
            connect();
        };

        initParticles();
        animate();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            observer.disconnect();
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                inset: 0,
                zIndex: 0,
                pointerEvents: 'none',
            }}
            aria-hidden="true"
        />
    );
};

export default HeroParticles;
