"use client";

import { useEffect, useRef } from "react";

/** Owns only the decorative login scene; no global providers or styles. */
export default function SeedGrowthAnimation() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    let disposed = false;
    let loading = false;
    let cleanup: (() => void) | undefined;

    const sync = async () => {
      if (!desktop.matches) {
        cleanup?.();
        cleanup = undefined;
        return;
      }
      if (cleanup || loading) return;
      loading = true;
      try {
        const { mountSeedGrowthScene } = await import("./seed-growth-scene");
        if (!disposed && desktop.matches) {
          cleanup = mountSeedGrowthScene(host);
        }
      } catch (error) {
        // The static illustration stays visible if WebGL is unavailable.
        if (process.env.NODE_ENV === "development") {
          console.warn("Login growth scene could not start:", error);
        }
      } finally {
        loading = false;
      }
    };
    void sync();
    desktop.addEventListener("change", sync);
    return () => {
      disposed = true;
      desktop.removeEventListener("change", sync);
      cleanup?.();
    };
  }, []);

  return (
    <div className="relative z-10 w-full max-w-lg mb-2">
      <div
        ref={hostRef}
        role="img"
        aria-label="کاشت بذر در سینی نشای شش سلولی، آبیاری همه سلول‌ها و رشد جوانه‌ها"
        className="relative h-[310px] xl:h-[360px] w-full pointer-events-none"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 500 360"
          className="absolute inset-0 h-full w-full"
        >
          <ellipse
            cx="250"
            cy="293"
            rx="175"
            ry="25"
            fill="#020d14"
            opacity="0.25"
          />
          <g transform="translate(78 205) skewY(-8)">
            <rect width="345" height="86" y="18" rx="12" fill="#203e34" />
            <rect width="345" height="74" rx="12" fill="#3b6050" />
            {Array.from({ length: 6 }, (_, index) => {
              const x = 20 + (index % 3) * 109;
              const y = 9 + Math.floor(index / 3) * 33;
              return (
                <g key={index} transform={`translate(${x} ${y})`}>
                  <rect width="88" height="24" rx="5" fill="#243b2e" />
                  <rect
                    x="4"
                    y="3"
                    width="80"
                    height="18"
                    rx="4"
                    fill="#4e3525"
                  />
                  <path
                    d="M43 12 Q39 -15 45 -51"
                    stroke="#b6ce64"
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M45 -49 Q26 -52 19 -61 Q37 -65 45 -49"
                    fill="#a3ca42"
                  />
                  <path
                    d="M45 -49 Q41 -66 52 -80 Q66 -79 57 -62Z"
                    fill="#b5d94c"
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
}
