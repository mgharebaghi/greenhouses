"use client";
import { useState, useEffect } from "react";

export default function Dashboard() {
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
    <div className="h-full w-full overflow-hidden relative bg-gradient-to-br from-emerald-50 via-lime-50 to-white">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 opacity-20 sm:opacity-30">
        <div className="absolute top-0 left-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-40 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] sm:opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
          backgroundSize: "30px 30px",
        }}
      ></div>

      {/* Decorative Elements - Corners */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 opacity-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-t-4 border-l-4 border-emerald-500 rounded-tl-3xl"></div>
      </div>
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 opacity-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-t-4 border-r-4 border-lime-500 rounded-tr-3xl"></div>
      </div>
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 opacity-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-b-4 border-l-4 border-emerald-500 rounded-bl-3xl"></div>
      </div>
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 opacity-10">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-b-4 border-r-4 border-lime-500 rounded-br-3xl"></div>
      </div>

      {/* Floating Icons - More vibrant and diverse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large decorative icons - desktop only */}
        <div className="hidden lg:block">
          <div className="absolute top-[15%] left-[8%] text-3xl animate-float opacity-20">🌱</div>
          <div className="absolute top-[20%] right-[12%] text-2xl animate-float-delayed opacity-20">🌿</div>
          <div className="absolute bottom-[15%] left-[15%] text-3xl animate-float-slow opacity-20">🏡</div>
          <div className="absolute top-[55%] right-[10%] text-2xl animate-float opacity-20">🌾</div>
          <div className="absolute bottom-[20%] right-[20%] text-3xl animate-float-delayed opacity-20">💧</div>
          <div className="absolute top-[35%] left-[5%] text-2xl animate-float-slow opacity-15">�</div>
          <div className="absolute top-[45%] right-[8%] text-2xl animate-float opacity-15">🍃</div>
          <div className="absolute bottom-[35%] left-[25%] text-2xl animate-float-delayed opacity-15">�</div>
          <div className="absolute top-[65%] left-[12%] text-xl animate-float-slow opacity-15">�</div>
          <div className="absolute bottom-[25%] right-[15%] text-xl animate-float opacity-15">☀️</div>
        </div>

        {/* Medium icons - tablet and up */}
        <div className="hidden md:block lg:hidden">
          <div className="absolute top-[18%] left-[10%] text-2xl animate-float opacity-20">🌱</div>
          <div className="absolute top-[25%] right-[15%] text-xl animate-float-delayed opacity-20">�</div>
          <div className="absolute bottom-[20%] left-[18%] text-2xl animate-float-slow opacity-20">💧</div>
          <div className="absolute top-[60%] right-[12%] text-xl animate-float opacity-20">🌾</div>
          <div className="absolute bottom-[30%] right-[22%] text-xl animate-float-delayed opacity-15">🍃</div>
        </div>

        {/* Small icons - mobile */}
        <div className="md:hidden">
          <div className="absolute top-[12%] left-[5%] text-xl animate-float opacity-15">🌱</div>
          <div className="absolute top-[15%] right-[8%] text-lg animate-float-delayed opacity-15">🌿</div>
          <div className="absolute bottom-[12%] left-[10%] text-xl animate-float-slow opacity-15">💧</div>
          <div className="absolute bottom-[18%] right-[12%] text-lg animate-float opacity-15">☀️</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative h-full w-full flex items-center justify-center px-3 sm:px-4 lg:px-6 z-10">
        <div className="text-center w-full max-w-6xl animate-fade-in-up">
          {/* Icon */}
          <div className="flex justify-center mb-2 sm:mb-3">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 bg-gradient-to-br from-emerald-400 to-lime-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
                <span className="text-xl sm:text-2xl lg:text-3xl -rotate-12 hover:rotate-0 transition-transform duration-500">
                  🌱
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-emerald-900 leading-tight drop-shadow-sm mb-2 sm:mb-3">
            <span className="inline-block animate-slide-in-left">سامانه</span>{" "}
            <span className="inline-block animate-slide-in-right bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-600 bg-clip-text text-transparent">
              گلخانه هوشمند
            </span>
          </h1>

          {/* Subtitle with Typing Animation */}
          <div className="h-12 sm:h-14 lg:h-16 flex items-center justify-center px-2 mb-3 sm:mb-4">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg text-emerald-700 font-semibold max-w-2xl mx-auto drop-shadow-sm">
              {typedText}
              <span className="inline-block w-0.5 h-3 sm:h-4 bg-emerald-600 mr-1 animate-blink align-middle"></span>
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 lg:gap-2.5 mb-4 sm:mb-5 lg:mb-6 px-2 animate-fade-in-more-delayed">
            <div className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-[10px] sm:text-xs lg:text-sm group">
              <span className="inline-block group-hover:scale-110 transition-transform">📊</span> پایش لحظه‌ای
            </div>
            <div className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-[10px] sm:text-xs lg:text-sm group">
              <span className="inline-block group-hover:scale-110 transition-transform">🌡️</span> کنترل هوشمند
            </div>
            <div className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-[10px] sm:text-xs lg:text-sm group">
              <span className="inline-block group-hover:scale-110 transition-transform">📈</span> گزارش‌گیری دقیق
            </div>
            <div className="px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-[10px] sm:text-xs lg:text-sm group">
              <span className="inline-block group-hover:scale-110 transition-transform">💡</span> هوش مصنوعی
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4 max-w-4xl mx-auto px-2 animate-fade-in-more-delayed">
            <div className="relative bg-white/70 backdrop-blur-md border-2 border-emerald-200/60 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-emerald-300 transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-4 -right-4 text-5xl sm:text-6xl lg:text-7xl opacity-10 group-hover:opacity-20 transition-opacity">
                🌿
              </div>
              <div className="relative z-10">
                <div className="text-xl sm:text-2xl lg:text-3xl mb-1 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                  🌿
                </div>
                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-emerald-700">+۹۵٪</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-emerald-600 font-medium mt-0.5">بهره‌وری</div>
              </div>
            </div>
            <div className="relative bg-white/70 backdrop-blur-md border-2 border-lime-200/60 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-lime-300 transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-4 -right-4 text-5xl sm:text-6xl lg:text-7xl opacity-10 group-hover:opacity-20 transition-opacity">
                💧
              </div>
              <div className="relative z-10">
                <div className="text-xl sm:text-2xl lg:text-3xl mb-1 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300">
                  💧
                </div>
                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-lime-700">-۶۰٪</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-lime-600 font-medium mt-0.5">مصرف آب</div>
              </div>
            </div>
            <div className="relative bg-white/70 backdrop-blur-md border-2 border-emerald-200/60 rounded-xl lg:rounded-2xl p-3 sm:p-4 lg:p-5 shadow-lg hover:shadow-2xl hover:scale-105 hover:border-emerald-300 transition-all duration-300 group overflow-hidden">
              <div className="absolute -top-4 -right-4 text-5xl sm:text-6xl lg:text-7xl opacity-10 group-hover:opacity-20 transition-opacity">
                📊
              </div>
              <div className="relative z-10">
                <div className="text-xl sm:text-2xl lg:text-3xl mb-1 group-hover:scale-110 transition-all duration-300">
                  📊
                </div>
                <div className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-emerald-700">۲۴/۷</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-emerald-600 font-medium mt-0.5">پایش مستمر</div>
              </div>
            </div>
          </div>

          {/* Bottom decorative line */}
          <div className="flex items-center justify-center gap-2 mt-5 sm:mt-6 lg:mt-8 opacity-30">
            <div className="h-0.5 w-12 sm:w-16 lg:w-20 bg-gradient-to-r from-transparent to-emerald-400"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400"></div>
            <div className="h-0.5 w-16 sm:w-24 lg:w-32 bg-emerald-400"></div>
            <div className="h-1.5 w-1.5 rounded-full bg-lime-400"></div>
            <div className="h-0.5 w-12 sm:w-16 lg:w-20 bg-gradient-to-l from-transparent to-lime-400"></div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-30px);
          }
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-float-slow {
          animation: float-slow 10s ease-in-out infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out 0.2s backwards;
        }
        .animate-fade-in-delayed {
          animation: fade-in-up 1s ease-out 0.4s backwards;
        }
        .animate-fade-in-more-delayed {
          animation: fade-in-up 1s ease-out 0.6s backwards;
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
}
