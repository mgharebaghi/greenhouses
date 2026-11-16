"use client";

import FormFeedback from "@/shared/components/FormFeedback";

import {
  Checkbox,
  Form,
  FormAppearance,
  FormItem,
  Input,
} from "@/shared/components/FormControls";

import { submitForm } from "@/shared/forms/submit";

import { signIn } from "@/features/auth/actions";
import SeedGrowthAnimation from "./SeedGrowthAnimation";
import {
  CheckCircleFilled,
  LoadingOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    username: string;
    password: string;
    remember: boolean;
  }) => {
    await submitForm(
      async () => {
        setLoading(true);
        setError(null);
        const minDelay = new Promise((resolve) => setTimeout(resolve, 800));
        const [res] = await Promise.all([signIn(values), minDelay]);

        if (res?.status === "error") {
          setError(res.message || "اطلاعات ورود اشتباه است");
          setLoading(false);
          return;
        }

        if (res?.status === "ok") {
          router.replace("/dashboard");
        }
      },
      (feedback) => setError(feedback.message),
      () => setLoading(false),
    );
  };

  return (
    <div
      dir="rtl"
      className="min-h-dvh w-full flex font-IransansR overflow-x-clip bg-[#f0fdf4] dark:bg-slate-950 transition-colors duration-500"
    >
      {/* 
        ========================================
        RIGHT PANEL: Seed growth story
        ========================================
      */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0f172a] flex-col justify-center items-center p-8 xl:p-12 text-white z-10 transition-colors duration-1000 perspective-1000">
        {/* --- Background System --- */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950"></div>
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-emerald-500/20 rounded-full blur-[120px] animate-float-slow mix-blend-screen opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-teal-400/20 rounded-full blur-[100px] animate-float-delayed mix-blend-screen opacity-60"></div>
          <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-lime-400/10 rounded-full blur-[80px] animate-pulse-slow mix-blend-screen opacity-50"></div>
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          ></div>
        </div>

        <SeedGrowthAnimation />

        {/* --- Content Section --- */}
        <div className="relative z-10 w-full max-w-lg mt-6 animate-fade-in-up animation-delay-200 text-center lg:text-right px-4">
          <h2 className="text-3xl xl:text-4xl font-black mb-4 text-white leading-tight drop-shadow-lg">
            سامانه مدیریت هوشمند گلخانه <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              فکور پیوند آریا
            </span>
          </h2>
          <p className="text-slate-300 text-base xl:text-md font-light leading-loose mb-8 text-justify opacity-80">
            این سامانه جهت پایش، کنترل و مدیریت یکپارچه واحدهای گلخانه‌ای فکور
            پیوند آریا طراحی و پیاده‌سازی شده است. دسترسی به این پنل صرفاً برای
            پرسنل مجاز امکان‌پذیر می‌باشد.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">
                تحلیل هوشمند اقلیم
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">
                آبیاری خودکار
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-lime-500/20 flex items-center justify-center text-lime-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">
                پایش رشد گیاه
              </span>
            </div>
            <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-xl p-3 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                <CheckCircleFilled className="text-lg" />
              </div>
              <span className="text-sm font-bold text-slate-200">
                گزارشات پیشرفته
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================
        LEFT PANEL: The Glass Control Interface
        ========================================
      */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        {/* Animated Background Blob for Depth */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>

        <div className="w-full max-w-[460px] relative z-10">
          {/* THE GLASS CARD */}
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-5 sm:rounded-[2.5rem] sm:p-12 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.1)] dark:shadow-none border border-white/60 dark:border-slate-700/50 relative overflow-hidden animate-fade-in-up">
            {/* Top Accent Light */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent"></div>

            <div className="mb-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_30px_-5px_rgba(16,185,129,0.15)] dark:shadow-none border border-emerald-50 dark:border-slate-700 flex items-center justify-center p-2 animate-fade-in-up">
                  <Image
                    src="/fakoor-logo.png"
                    alt="Logo"
                    width={80}
                    height={80}
                    className="object-contain"
                  />
                </div>
              </div>
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 font-IransansB mb-2 tracking-tight">
                خوش آمدید
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                لطفا مشخصات ورود خود را وارد کنید
              </p>
            </div>

            <FormAppearance>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                requiredMark={false}
                size="large"
                className="space-y-6"
              >
                <FormItem
                  name="username"
                  rules={[{ required: true, message: "نام کاربری الزامی است" }]}
                  className="mb-0"
                >
                  <Input
                    prefix={<UserOutlined className="text-slate-500" />}
                    placeholder="نام کاربری"
                    autoComplete="username"
                  />
                </FormItem>
                <FormItem
                  name="password"
                  rules={[{ required: true, message: "رمز عبور الزامی است" }]}
                  className="mb-2"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-slate-500" />}
                    placeholder="رمز عبور"
                    autoComplete="current-password"
                  />
                </FormItem>
                <div className="flex items-center justify-between pt-1">
                  <FormItem
                    name="remember"
                    valuePropName="checked"
                    initialValue={true}
                    noStyle
                  >
                    <Checkbox>مرا به خاطر بسپار</Checkbox>
                  </FormItem>
                  <a
                    href="#"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors hover:underline"
                  >
                    فراموشی رمز عبور؟
                  </a>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`relative w-full h-14 rounded-2xl font-bold text-lg text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)] dark:shadow-none transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98] ${loading ? "bg-slate-300 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:shadow-[0_20px_40px_rgba(16,185,129,0.3)]"}`}
                >
                  <span
                    className={`flex items-center justify-center  gap-2 ${loading ? "opacity-0" : "opacity-100"} cursor-pointer`}
                  >
                    ورود به سیستم
                  </span>
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoadingOutlined className="text-2xl animate-spin text-white" />
                    </div>
                  )}
                </button>
                <FormFeedback
                  message={error ? { status: "error", message: error } : null}
                />
              </Form>
            </FormAppearance>
          </div>
          <div className="mt-8 text-center animate-fade-in-up animation-delay-200">
            <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">
              © ۲۰۲۵ سامانه هوشمند مدیریت گلخانه - فکور پیوند آریا
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-IransansR {
          font-family: "IransansR", sans-serif !important;
        }
        .font-IransansB {
          font-family: "IransansB", sans-serif !important;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px white inset !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        @keyframes float-slow {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(15px, -15px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-10px, 10px);
          }
        }
        .animate-float-delayed {
          animation: float-delayed 12s ease-in-out infinite;
        }
        @keyframes float-reverse {
          0%,
          100% {
            transform: translate(0, 0) scale(0.9);
          }
          50% {
            transform: translate(10px, 5px) scale(0.95);
          }
        }
        .animate-float-reverse {
          animation: float-reverse 10s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s ease-in-out infinite;
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animation-delay-500 {
          animation-delay: 0.5s;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
