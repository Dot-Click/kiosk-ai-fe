import { useEffect, useRef, useState } from "react";

const isTouchDevice =
  typeof window !== "undefined" &&
  (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -300, y: -300 });
  const ringPos = useRef({ x: -300, y: -300 });
  const rafId = useRef<number>(0);

  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  useEffect(() => {
    if (isTouchDevice) return;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const isInteractive = (el: HTMLElement) =>
      !!el.closest(
        "button, a, [role='button'], input, textarea, select, " +
        "[data-cursor], .cursor-card, .cursor-method-tile"
      );

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      setHovered(isInteractive(e.target as HTMLElement));
    };

    const onDown = (e: MouseEvent) => {
      setClicking(true);
      const id = ++rippleId.current;
      setRipples(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 700);
    };

    const onUp = () => setClicking(false);

    const tick = () => {
      const speed = 0.12;
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, speed);
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, speed);

      if (dotRef.current) {
        dotRef.current.style.left = `${mouse.current.x}px`;
        dotRef.current.style.top = `${mouse.current.y}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringPos.current.x}px`;
        ringRef.current.style.top = `${ringPos.current.y}px`;
      }

      rafId.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  if (isTouchDevice) return null;

  const ringSize = clicking ? 24 : hovered ? 120 : 40;
  const ringOpacity = clicking ? 0.5 : 1;

  return (
    <>
      <style>{`
        @keyframes cursor-pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          50%       { transform: translate(-50%, -50%) scale(1.25); opacity: 1; }
        }
        @keyframes ripple-out {
          0%   { transform: translate(-50%, -50%) scale(0.3); opacity: 0.8; }
          100% { transform: translate(-50%, -50%) scale(3);   opacity: 0; }
        }
        body { cursor: none !important; }
        @media (pointer: coarse) {
          body { cursor: auto !important; }
          .cc-dot, .cc-ring, .cc-ripple { display: none !important; }
        }
      `}</style>

      {/* Dot */}
      <div
        ref={dotRef}
        className="cc-dot"
        aria-hidden="true"
        style={{
          position: "fixed",
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          backgroundColor: "#FF2D78",
          boxShadow: "0 0 10px 3px rgba(255,45,120,0.8)",
          transform: "translate(-50%, -50%)",
          opacity: hovered ? 0 : 1,
          pointerEvents: "none",
          zIndex: 999999,
          transition: "opacity 0.25s ease",
          willChange: "left, top",
        }}
      />

      {/* Ring */}
      <div
        ref={ringRef}
        className="cc-ring"
        aria-hidden="true"
        style={{
          position: "fixed",
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          borderRadius: "50%",
          border: hovered
            ? "1.5px solid rgba(255,255,255,0.9)"
            : "1.5px solid transparent",
          backgroundImage: hovered
            ? "none"
            : "none",
          backgroundOrigin: "border-box",
          boxShadow: hovered
            ? "0 0 0 1px #FF2D78, 0 0 20px 6px rgba(255,45,120,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)"
            : "0 0 12px 3px rgba(139,92,246,0.3)",
          outline: hovered ? "none" : "1.5px solid",
          outlineColor: hovered ? "transparent" : "transparent",
          background: hovered
            ? "rgba(255,255,255,0.04)"
            : "transparent",
          backdropFilter: hovered ? "blur(4px)" : "none",
          WebkitBackdropFilter: hovered ? "blur(4px)" : "none",
          transform: `translate(-50%, -50%)`,
          opacity: ringOpacity,
          pointerEvents: "none",
          zIndex: 999998,
          transition: [
            `width ${clicking ? "150ms" : hovered ? "400ms" : "300ms"} cubic-bezier(0.34,1.56,0.64,1)`,
            `height ${clicking ? "150ms" : hovered ? "400ms" : "300ms"} cubic-bezier(0.34,1.56,0.64,1)`,
            "opacity 0.2s ease",
            "box-shadow 0.3s ease",
            "background 0.3s ease",
            "border-color 0.3s ease",
            "backdrop-filter 0.3s ease",
          ].join(", "),
          animation: !hovered && !clicking ? "cursor-pulse 2s ease-in-out infinite" : "none",
          willChange: "left, top, width, height",
        }}
      >
        {/* Gradient ring border via pseudo-like inner element */}
        {!hovered && (
          <div style={{
            position: "absolute",
            inset: "-1.5px",
            borderRadius: "50%",
            padding: "1.5px",
            background: "linear-gradient(135deg, #FF2D78, #8B5CF6)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }} />
        )}

        {/* Crosshair — only when hovered */}
        {hovered && (
          <>
            {/* Horizontal line */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "12%",
              right: "12%",
              height: "1px",
              background: "rgba(255,255,255,0.25)",
              transform: "translateY(-50%)",
            }} />
            {/* Vertical line */}
            <div style={{
              position: "absolute",
              left: "50%",
              top: "12%",
              bottom: "12%",
              width: "1px",
              background: "rgba(255,255,255,0.25)",
              transform: "translateX(-50%)",
            }} />
            {/* Diagonal \ */}
            <div style={{
              position: "absolute",
              inset: "28%",
              border: "none",
              background: "linear-gradient(135deg, transparent 45%, rgba(255,45,120,0.2) 45%, rgba(255,45,120,0.2) 55%, transparent 55%)",
            }} />
            {/* Diagonal / */}
            <div style={{
              position: "absolute",
              inset: "28%",
              background: "linear-gradient(45deg, transparent 45%, rgba(255,45,120,0.2) 45%, rgba(255,45,120,0.2) 55%, transparent 55%)",
            }} />
            {/* Center dot */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#FF2D78",
              transform: "translate(-50%, -50%)",
              boxShadow: "0 0 6px 2px rgba(255,45,120,0.8)",
            }} />
          </>
        )}
      </div>

      {/* Ripples */}
      {ripples.map(r => (
        <div
          key={r.id}
          className="cc-ripple"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1.5px solid rgba(255,45,120,0.7)",
            transform: "translate(-50%, -50%) scale(0.3)",
            opacity: 0.8,
            pointerEvents: "none",
            zIndex: 999997,
            animation: "ripple-out 0.7s cubic-bezier(0.2,0.8,0.4,1) forwards",
          }}
        />
      ))}
      {ripples.map(r => (
        <div
          key={`${r.id}-b`}
          className="cc-ripple"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(139,92,246,0.5)",
            transform: "translate(-50%, -50%) scale(0.3)",
            opacity: 0.6,
            pointerEvents: "none",
            zIndex: 999996,
            animation: "ripple-out 0.7s cubic-bezier(0.2,0.8,0.4,1) 0.08s forwards",
          }}
        />
      ))}
      {ripples.map(r => (
        <div
          key={`${r.id}-c`}
          className="cc-ripple"
          aria-hidden="true"
          style={{
            position: "fixed",
            left: `${r.x}px`,
            top: `${r.y}px`,
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "1px solid rgba(255,45,120,0.3)",
            transform: "translate(-50%, -50%) scale(0.3)",
            opacity: 0.4,
            pointerEvents: "none",
            zIndex: 999995,
            animation: "ripple-out 0.7s cubic-bezier(0.2,0.8,0.4,1) 0.16s forwards",
          }}
        />
      ))}
    </>
  );
};

export default CustomCursor;
