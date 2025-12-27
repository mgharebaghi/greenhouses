"use client";
import "@ant-design/v5-patch-for-react-19";

import { Checkbox, Form, Input } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/lib/auth";
import { UserOutlined, LockOutlined, LoadingOutlined, CheckCircleFilled } from "@ant-design/icons";
import Image from "next/image";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [form] = Form.useForm();
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    setError(null);
    const minDelay = new Promise(resolve => setTimeout(resolve, 800));
    const [res] = await Promise.all([signIn(values), minDelay]);

    if (res?.status === "error") {
      setError(res.message || "اطلاعات ورود اشتباه است");
      setLoading(false);
      return;
    }

    if (res?.status === "ok") {
      router.replace("/dashboard");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen w-full flex font-IransansR overflow-hidden bg-[#f0fdf4]">

      {/* 
        ========================================
        LEFT PANEL: The "Living Glass Ecosystem"
        ========================================
      */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f172a] flex-col justify-center items-center p-8 xl:p-12 text-white z-10 transition-colors duration-1000 perspective-1000">

        {/* --- Background System --- */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/20 rounded-full blur-[120px] animate-float-slow mix-blend-screen opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-400/20 rounded-full blur-[100px] animate-float-delayed mix-blend-screen opacity-60"></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-lime-400/10 rounded-full blur-[80px] animate-pulse-slow mix-blend-screen opacity-50"></div>
          <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>

        {/* --- Glass Ecosystem Visual --- */}
        <div className="relative z-10 w-full max-w-lg h-[450px] flex items-center justify-center mb-0 scale-90 xl:scale-100 transition-transform duration-700">
          {/* Center Hub */}
          <div className="absolute z-20 w-80 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-300">
                <Image src="/Images/Logo.png" alt="Logo" width={32} height={32} className="opacity-90" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100">Greenhouse OS</h3>
                <span className="text-xs text-emerald-400 font-mono">v2.4.0 • Live</span>
              </div>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-emerald-500/10 to-transparent rounded-xl border-b border-white/5 relative overflow-hidden mb-4">
              <svg className="absolute bottom-0 left-0 w-full h-16 text-emerald-400" preserveAspectRatio="none" viewBox="0 0 100 50">
                <path fill="url(#grad1)" fillOpacity="0.4" stroke="currentColor" strokeWidth="1.5" d="M0,50 L0,30 Q10,20 20,35 T40,25 T60,10 T80,30 T100,20 L100,50 Z" />
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: 'rgb(52, 211, 153)', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: 'rgb(52, 211, 153)', stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Status</span>
              <span className="text-emerald-400 font-bold">Optimal</span>
            </div>
          </div>

          {/* Orbiting Satellites */}
          <div className="absolute top-20 -right-4 z-10 w-48 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl animate-float-delayed animation-delay-1000">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Climate</span>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-white">24°</span>
              <span className="text-sm text-slate-400 mb-1">Celsius</span>
            </div>
          </div>

          <div className="absolute bottom-32 -left-8 z-30 w-52 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl animate-float-slow animation-delay-500">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Active Zones</span>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-500/20 rounded-lg p-2 text-center border border-blue-500/10">
                <span className="block text-xs text-blue-300">A1</span>
                <span className="block text-sm font-bold text-white">ON</span>
              </div>
              <div className="flex-1 bg-blue-500/20 rounded-lg p-2 text-center border border-blue-500/10">
                <span className="block text-xs text-blue-300">A2</span>
                <span className="block text-sm font-bold text-white">ON</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 right-0 z-0 w-44 bg-slate-800/20 backdrop-blur-md border border-white/5 rounded-2xl p-4 shadow-lg animate-float-reverse scale-90 opacity-70">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400 text-xs">🌱</div>
              <span className="text-xs text-lime-300">Growth</span>
            </div>
            <span className="text-xl font-bold text-white">Flowering</span>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="relative z-10 w-full max-w-lg mt-8 animate-fade-in-up animation-delay-200 text-center lg:text-right px-4">
          <h2 className="text-3xl xl:text-4xl font-black mb-4 text-white leading-tight drop-shadow-lg">
            آینده کشاورزی <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">در دستان شماست</span>
          </h2>
          <p className="text-slate-300 text-base xl:text-lg font-light leading-loose mb-8 text-justify opacity-90">
            پلتفرمی جامع برای پایش لحظه‌ای و کنترل هوشمند گلخانه‌های صنعتی.
            با بهره‌گیری از هوش مصنوعی، مصرف انرژی را کاهش داده و کیفیت محصولات خود را به سطح جهانی برسانید.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">تحلیل هوشمند اقلیم</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">آبیاری خودکار</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">پایش رشد گیاه</span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">گزارشات پیشرفته</span>
            </div>
          </div>
        </div>
      </div>


      {/* 
        ========================================
        RIGHT PANEL: The Glass Control Interface
        ========================================
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">

        {/* Animated Background Blob for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/50 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>

        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center lg:hidden z-20">
          <Image src="/Images/Logo.png" alt="Logo" width={40} height={40} />
        </div>

        <div className="w-full max-w-[460px] relative z-10">

          {/* THE GLASS CARD */}
          <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 sm:p-12 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)] border border-white/60 relative overflow-hidden animate-fade-in-up">

            {/* Top Accent Light */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>

            <div className="mb-10 text-center">
              <h2 className="text-3xl font-black text-slate-800 font-IransansB mb-2 tracking-tight">خوش آمدید</h2>
              <p className="text-slate-500 text-sm font-medium">لطفا مشخصات ورود خود را وارد کنید</p>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false} size="large" className="space-y-6">
              <Form.Item name="username" rules={[{ required: true, message: 'نام کاربری الزامی است' }]} className="mb-0">
                <div className={`relative transition-all duration-300 rounded-2xl ${focusedField === 'username' ? 'bg-white ring-4 ring-emerald-500/10 border-emerald-500/50' : error ? 'bg-red-50 border-red-200' : 'bg-white/50 border-white/50 hover:bg-white'} border shadow-sm`}>
                  <Input prefix={<UserOutlined className={`text-lg ml-3 transition-colors ${focusedField === 'username' ? 'text-emerald-600' : 'text-slate-400'}`} />} placeholder="نام کاربری" className="!bg-transparent !border-none !shadow-none h-14 text-base font-medium text-slate-700 placeholder:text-slate-400/80" onFocus={() => setFocusedField('username')} onBlur={() => setFocusedField(null)} />
                </div>
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'رمز عبور الزامی است' }]} className="mb-2">
                <div className={`relative transition-all duration-300 rounded-2xl ${focusedField === 'password' ? 'bg-white ring-4 ring-emerald-500/10 border-emerald-500/50' : error ? 'bg-red-50 border-red-200' : 'bg-white/50 border-white/50 hover:bg-white'} border shadow-sm`}>
                  <Input.Password prefix={<LockOutlined className={`text-lg ml-3 transition-colors ${focusedField === 'password' ? 'text-emerald-600' : 'text-slate-400'}`} />} placeholder="رمز عبور" className="!bg-transparent !border-none !shadow-none h-14 text-base font-medium text-slate-700 placeholder:text-slate-400/80" onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)} />
                </div>
              </Form.Item>
              <div className="flex items-center justify-between pt-1">
                <Form.Item name="remember" valuePropName="checked" initialValue={true} noStyle>
                  <Checkbox className="text-slate-500 text-xs font-bold hover:text-slate-700 transition-colors">مرا به خاطر بسپار</Checkbox>
                </Form.Item>
                <a href="#" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors hover:underline">فراموشی رمز عبور؟</a>
              </div>
              <button type="submit" disabled={loading} className={`relative w-full h-14 rounded-2xl font-bold text-lg text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] ${loading ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]'}`}>
                <span className={`flex items-center justify-center  gap-2 ${loading ? 'opacity-0' : 'opacity-100'} cursor-pointer`}>ورود به سیستم</span>
                {loading && (<div className="absolute inset-0 flex items-center justify-center"><LoadingOutlined className="text-2xl animate-spin text-white" /></div>)}
              </button>
              <div className={`transition-all duration-500 ease-out overflow-hidden ${error ? 'max-h-24 opacity-100 pt-4' : 'max-h-0 opacity-0 pt-0'}`}>
                <div className="bg-red-50/90 backdrop-blur-md border border-red-100 rounded-xl p-4 flex items-center gap-4 text-red-600 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-red-500 stroke-current stroke-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-red-700 mb-0.5">خطای ورودی</div>
                    <div className="text-xs font-medium opacity-90">{error}</div>
                  </div>
                </div>
              </div>
            </Form>
          </div>
          <div className="mt-8 text-center animate-fade-in-up animation-delay-200">
            <p className="text-slate-400 text-xs font-medium">© ۲۰۲۵ سامانه هوشمند مدیریت گلخانه</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-IransansR { font-family: "IransansR", sans-serif !important; }
        .font-IransansB { font-family: "IransansB", sans-serif !important; }
        input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active{ -webkit-box-shadow: 0 0 0 30px white inset !important; transition: background-color 5000s ease-in-out 0s; }
        @keyframes float-slow { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(15px, -15px); } }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        @keyframes float-delayed { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-10px, 10px); } }
        .animate-float-delayed { animation: float-delayed 12s ease-in-out infinite; }
        @keyframes float-reverse { 0%, 100% { transform: translate(0, 0) scale(0.9); } 50% { transform: translate(10px, 5px) scale(0.95); } }
        .animate-float-reverse { animation: float-reverse 10s ease-in-out infinite; }
        @keyframes pulse-slow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.05); } }
        .animate-pulse-slow { animation: pulse-slow 8s ease-in-out infinite; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animation-delay-200 { animation-delay: 0.2s; }
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
        .perspective-1000 { perspective: 1000px; }
      `}</style>
    </div>
  );
}
