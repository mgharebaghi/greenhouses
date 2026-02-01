"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function DashboardContent() {
  const [typedText, setTypedText] = useState("");
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const phrases = [
    "مدیریت پیشرفته کشاورزی با فناوری‌های نوین",
    "کنترل هوشمند دما، رطوبت و نور",
    "بهینه‌سازی مصرف آب و انرژی",
    "افزایش بهره‌وری و کاهش هزینه‌ها",
    "پایش لحظه‌ای و گزارش‌گیری دقیق",
  ];

  useEffect(() => {
    if (isPaused) return;

    const currentPhrase = phrases[currentPhraseIndex];
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          if (typedText.length < currentPhrase.length) {
            setTypedText(currentPhrase.slice(0, typedText.length + 1));
          } else {
            // Wait before deleting
            setIsPaused(true);
            setTimeout(() => {
              setIsPaused(false);
              setIsDeleting(true);
            }, 3000);
          }
        } else {
          // Deleting
          if (typedText.length > 0) {
            setTypedText(currentPhrase.slice(0, typedText.length - 1));
          } else {
            setIsDeleting(false);
            setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
            // Small pause before starting next phrase
            setIsPaused(true);
            setTimeout(() => setIsPaused(false), 500);
          }
        }
      },
      isDeleting ? 30 : 80
    );

    return () => clearTimeout(timeout);
  }, [typedText, currentPhraseIndex, isDeleting, isPaused]);

  return (
    <div className="h-full w-full overflow-hidden relative">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-100 via-lime-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-black animate-gradient-xy transition-colors duration-500"></div>

      {/* Organic Orb Animations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-300/30 dark:bg-emerald-600/10 rounded-full blur-[100px] animate-orb-float"></div>
        <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] bg-lime-300/30 dark:bg-lime-600/10 rounded-full blur-[100px] animate-orb-float-delayed"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] bg-teal-300/20 dark:bg-teal-600/10 rounded-full blur-[120px] animate-orb-float-reverse"></div>
      </div>

      {/* Particle Effect - Floating Spores */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-emerald-400 dark:bg-emerald-500 opacity-20 dark:opacity-40 animate-rise"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-20px',
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 6}px`,
              animationDuration: `${Math.random() * 10 + 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Scanning Grid Pattern Overlay - More subtle */}
      <div className="absolute inset-0 z-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(16 185 129 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(16 185 129 / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        ></div>
      </div>

      {/* Decorative Glass Shards */}
      <div className="absolute top-12 left-12 w-32 h-32 bg-white/5 dark:bg-white/5 backdrop-blur-3xl rounded-full border border-white/20 dark:border-white/10 hidden lg:block animate-float-slow pointer-events-none"></div>
      <div className="absolute bottom-24 right-12 w-48 h-48 bg-emerald-500/5 dark:bg-emerald-500/5 backdrop-blur-3xl rounded-full border border-white/10 hidden lg:block animate-float-delayed pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative h-full w-full flex items-center justify-center px-4 z-10">
        <div className="text-center w-full max-w-6xl animate-fade-in-up">
          {/* Logo Area */}
          <div className="flex justify-center mb-8 relative">
            {/* Glow behind logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/20 dark:bg-emerald-500/20 rounded-full blur-[80px] animate-pulse-slow pointer-events-none"></div>

            <div className="relative group cursor-default z-10">
              <div className="relative h-48 w-48 sm:h-64 sm:w-64 lg:h-80 lg:w-80 flex items-center justify-center hover:scale-105 transition-transform duration-700 ease-out">
                <Image
                  src="/fakoor-logo.png"
                  alt="Fakoor Peyvand Aria Logo"
                  width={320}
                  height={320}
                  className="object-contain drop-shadow-2xl w-full h-full filtered-drop-shadow"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Subtitle with Typing Animation - NOW THE MAIN FOCUS */}
          <div className="h-12 sm:h-14 lg:h-16 flex items-center justify-center px-2 mb-10 sm:mb-14 relative z-20">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/30 dark:bg-slate-900/40 blur-xl rounded-full opacity-0 sm:opacity-100 transition-opacity"></div>
              <p className="relative text-base sm:text-lg md:text-xl lg:text-2xl text-emerald-900 dark:text-emerald-100 font-bold max-w-3xl mx-auto drop-shadow-sm tracking-wide">
                {typedText}
                <span className="inline-block w-0.5 h-5 sm:h-6 bg-emerald-500 dark:bg-emerald-400 mr-1 animate-blink align-middle"></span>
              </p>
            </div>
          </div>

          {/* Features - Glass Pills */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-5 mb-10 sm:mb-14 lg:mb-16 px-2 animate-fade-in-more-delayed relative z-20">
            {["پایش لحظه‌ای", "کنترل هوشمند", "گزارش‌گیری دقیق", "هوش مصنوعی"].map((feature, idx) => (
              <div key={idx} className="relative group overflow-hidden px-5 py-2.5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-slate-600 rounded-2xl text-emerald-900 dark:text-emerald-100 font-bold hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 cursor-default text-xs sm:text-sm lg:text-base transform hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <span className="relative z-10 flex items-center gap-2">
                  <span className="text-lg">{idx === 0 && "📊"}
                    {idx === 1 && "🌡️"}
                    {idx === 2 && "📈"}
                    {idx === 3 && "💡"}</span>
                  {feature}
                </span>
              </div>
            ))}
          </div>

          {/* Stats Cards - Premium Glass */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-8 max-w-5xl mx-auto px-2 animate-fade-in-more-delayed">
            <div className="relative bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-900/10 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group overflow-hidden text-center transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl lg:text-5xl mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 inline-block filter drop-shadow-md">
                  🌿
                </div>
                <div className="text-xl lg:text-4xl font-black text-emerald-800 dark:text-emerald-400 mt-2 tracking-tight">+۹۵٪</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-emerald-700/70 dark:text-emerald-300/60 font-medium mt-1 uppercase tracking-wider">بهره‌وری محصولات</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-900/10 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:shadow-lime-500/10 transition-all duration-500 group overflow-hidden text-center transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-lime-500/5 dark:bg-lime-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl lg:text-5xl mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 inline-block filter drop-shadow-md">
                  💧
                </div>
                <div className="text-xl lg:text-4xl font-black text-lime-700 dark:text-lime-400 mt-2 tracking-tight">-۶۰٪</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-lime-700/70 dark:text-lime-300/60 font-medium mt-1 uppercase tracking-wider">مصرف آب</div>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-white/40 to-white/10 dark:from-slate-800/40 dark:to-slate-900/10 backdrop-blur-xl border border-white/40 dark:border-slate-700/40 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 group overflow-hidden text-center transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="text-3xl lg:text-5xl mb-3 group-hover:scale-110 transition-all duration-500 inline-block filter drop-shadow-md">
                  📊
                </div>
                <div className="text-xl lg:text-4xl font-black text-emerald-800 dark:text-emerald-400 mt-2 tracking-tight">۲۴/۷</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-emerald-700/70 dark:text-emerald-300/60 font-medium mt-1 uppercase tracking-wider">پایش هوشمند</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes orb-float {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(30px, -50px); }
            66% { transform: translate(-20px, 40px); }
        }
        @keyframes orb-float-delayed {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(-40px, 30px); }
            66% { transform: translate(20px, -20px); }
        }
        @keyframes orb-float-reverse {
            0%, 100% { transform: translate(0, 0); }
            33% { transform: translate(20px, 40px); }
            66% { transform: translate(-30px, -30px); }
        }
        .animate-orb-float { animation: orb-float 20s infinite ease-in-out; }
        .animate-orb-float-delayed { animation: orb-float-delayed 25s infinite ease-in-out; }
        .animate-orb-float-reverse { animation: orb-float-reverse 22s infinite ease-in-out; }

        @keyframes rise {
            0% { transform: translateY(100vh) scale(0); opacity: 0; }
            50% { opacity: 0.5; }
            100% { transform: translateY(-20vh) scale(1.5); opacity: 0; }
        }
        .animate-rise {
            animation-name: rise;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
        }

        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
        .animate-shimmer { animation: shimmer 1.5s infinite; }

        @keyframes pulse-slow {
            0%, 100% { opacity: 0.2; transform: translate(-50%, -50%) scale(1); }
            50% { opacity: 0.4; transform: translate(-50%, -50%) scale(1.1); }
        }
        .animate-pulse-slow { animation: pulse-slow 6s infinite ease-in-out; }

        @keyframes float-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
         .animate-float-slow { animation: float-slow 10s infinite ease-in-out; }
         .animate-float-delayed { animation: float-slow 12s infinite ease-in-out reverse; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-more-delayed { animation: fade-in-up 1s ease-out 0.6s backwards; }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        .animate-blink { animation: blink 1s infinite; }

        .filtered-drop-shadow { filter: drop-shadow(0 0 15px rgba(16, 185, 129, 0.3)); }
        .dark .filtered-drop-shadow { filter: drop-shadow(0 0 30px rgba(16, 185, 129, 0.4)); }
      `}</style>
    </div>
  );
}
