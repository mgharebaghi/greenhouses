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
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgb(16 185 129) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-32 left-[10%] text-5xl animate-float opacity-30">🌱</div>
        <div className="absolute top-48 right-[15%] text-4xl animate-float-delayed opacity-25">🌿</div>
        <div className="absolute bottom-40 left-[20%] text-6xl animate-float-slow opacity-30">🏡</div>
        <div className="absolute top-[60%] right-[25%] text-4xl animate-float opacity-30">🌾</div>
        <div className="absolute bottom-32 right-[30%] text-5xl animate-float-delayed opacity-25">💧</div>
      </div>

      {/* Main Content */}
      <div className="relative h-screen w-full flex items-center justify-center px-6 z-10">
        <div className="text-center space-y-6 max-w-5xl w-full animate-fade-in-up">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative h-20 w-20 bg-gradient-to-br from-emerald-400 to-lime-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-12 hover:rotate-0 transition-transform duration-500">
                <span className="text-4xl -rotate-12 hover:rotate-0 transition-transform duration-500">🌱</span>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-emerald-900 leading-tight drop-shadow-sm">
            <span className="inline-block animate-slide-in-left">سامانه</span>
            <br />
            <span className="inline-block animate-slide-in-right bg-gradient-to-r from-emerald-600 via-emerald-500 to-lime-600 bg-clip-text text-transparent">
              گلخانه هوشمند
            </span>
          </h1>

          {/* Subtitle with Typing Animation */}
          <div className="h-16 flex items-center justify-center">
            <p className="text-base md:text-lg text-emerald-700 font-semibold max-w-2xl mx-auto drop-shadow-sm">
              {typedText}
              <span className="inline-block w-0.5 h-5 bg-emerald-600 mr-1 animate-blink"></span>
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-3 mt-6 animate-fade-in-more-delayed">
            <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-sm">
              📊 پایش لحظه‌ای
            </div>
            <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-sm">
              🌡️ کنترل هوشمند
            </div>
            <div className="px-4 py-2 bg-white/80 backdrop-blur-md border-2 border-emerald-200 rounded-full text-emerald-700 font-bold hover:bg-emerald-50 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default text-sm">
              📈 گزارش‌گیری دقیق
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto animate-fade-in-more-delayed">
            <div className="bg-white/60 backdrop-blur-md border-2 border-emerald-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-1">🌿</div>
              <div className="text-xl font-bold text-emerald-700 mb-1">+۹۵٪</div>
              <div className="text-xs text-emerald-600 font-medium">بهره‌وری بالاتر</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border-2 border-lime-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-1">💧</div>
              <div className="text-xl font-bold text-lime-700 mb-1">-۶۰٪</div>
              <div className="text-xs text-lime-600 font-medium">مصرف آب کمتر</div>
            </div>
            <div className="bg-white/60 backdrop-blur-md border-2 border-emerald-200/50 rounded-2xl p-4 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              <div className="text-3xl mb-1">📊</div>
              <div className="text-xl font-bold text-emerald-700 mb-1">۲۴/۷</div>
              <div className="text-xs text-emerald-600 font-medium">پایش مستمر</div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-8 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-emerald-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
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
