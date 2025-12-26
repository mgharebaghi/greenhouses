export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
            <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-emerald-400/20 blur-xl rounded-full animate-pulse-glow" />

                {/* Greenhouse/Nature SVG Icon */}
                <svg
                    className="relative w-24 h-24 text-emerald-600 animate-bounce-slow"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 21C3 21 4.5 9 12 9C19.5 9 21 21 21 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 21V9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 16C12 16 14.5 13 18 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M12 13C12 13 9.5 10 6 10"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <h3 className="text-xl font-bold text-emerald-800 tracking-wide font-IransansB">
                    سامانه مدیریت گلخانه
                </h3>
                <p className="text-sm text-emerald-600/80 font-IransansR animate-pulse">
                    در حال بارگذاری...
                </p>
            </div>
        </div>
    );
}
