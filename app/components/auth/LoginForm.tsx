"use client";
import "@ant-design/v5-patch-for-react-19";

// import PrimaryButton from "../UI/Button";
import GreenhouseButton from "../UI/GreenhouseButton";
import { Alert, Checkbox, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/lib/auth";
import { UserOutlined, LockOutlined, EnvironmentOutlined, CheckCircleOutlined } from "@ant-design/icons";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();
  // typing state for green UI while user types
  const [typing, setTyping] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });
  const [authError, setAuthError] = useState<boolean>(false);
  // new: track edits after an auth error per field
  const [editedAfterError, setEditedAfterError] = useState<{ username: boolean; password: boolean }>({
    username: false,
    password: false,
  });
  // new: track if inputs have changed (non-empty) to keep them green after typing
  const [dirty, setDirty] = useState<{ username: boolean; password: boolean }>({ username: false, password: false });

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    setError(null);
    setAuthError(false);
    setEditedAfterError({ username: false, password: false }); // reset edit flags before submit
    const res = await signIn(values);

    if (res?.status === "error") {
      setError(res.message || "خطایی رخ داده است. لطفا دوباره تلاش کنید.");
      setAuthError(true); // show red on fields
      setLoading(false);
      return;
    }

    if (res?.status === "ok") {
      setLoading(false);
      route.replace("/dashboard");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-lime-100 flex items-stretch px-4 sm:px-6 lg:px-8 py-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 w-full max-w-6xl mx-auto gap-6 lg:gap-10 items-stretch">
        {/* LEFT: description */}
        <section className="relative overflow-hidden p-6 sm:p-10 lg:p-14 flex items-center justify-center lg:min-h-[80vh] order-2 lg:order-1 text-center sm:text-right">
          {/* greenhouse-themed wallpaper scoped to left */}
          <div className="absolute inset-0 -z-10 pointer-events-none hidden md:block">
            <div className="absolute -top-24 -right-24 h-80 w-80 bg-yellow-200/40 blur-3xl rounded-full" />
            <div className="absolute top-1/3 -left-24 h-72 w-72 bg-emerald-300/25 blur-3xl rounded-full" />
            <div className="absolute bottom-10 -right-16 h-64 w-64 bg-lime-300/20 blur-3xl rounded-full" />
            <svg className="absolute inset-0 w-full h-full opacity-25 mix-blend-multiply" aria-hidden="true">
              <defs>
                <pattern id="gh-grid" width="80" height="80" patternUnits="userSpaceOnUse">
                  <path d="M80 0H0V80" stroke="rgba(16,185,129,0.15)" strokeWidth="1" />
                </pattern>
                <linearGradient id="pane-glow" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.08)" />
                  <stop offset="100%" stopColor="rgba(132,204,22,0.06)" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#gh-grid)" />
              <rect width="100%" height="100%" fill="url(#pane-glow)" />
            </svg>
            <div className="absolute -top-12 left-1/4 h-64 w-[140%] -rotate-12 bg-gradient-to-b from-yellow-100/25 via-transparent to-transparent" />
            <div className="absolute top-0 right-1/3 h-72 w-[140%] rotate-6 bg-gradient-to-b from-lime-100/20 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-24 opacity-60">
              <svg className="w-full h-full" aria-hidden="true">
                <path d="M0 24 Q 160 0 320 24 T 640 24 V 96 H0 Z" fill="rgba(209,250,229,0.6)" />
              </svg>
            </div>
          </div>

          <div className="relative z-10 max-w-xl text-emerald-900">
            <div className="flex items-center gap-3 mb-4">
              <span className="h-12 w-12 rounded-full bg-emerald-100 ring-1 ring-emerald-200 grid place-items-center text-emerald-700">
                <EnvironmentOutlined />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold">سامانه هوشمند مدیریت گلخانه</h1>
            </div>
            <p className="text-sm sm:text-base text-emerald-800/90 leading-7">
              پایش محیط، کنترل اقلیم و آبیاری خودکار در یک داشبورد یکپارچه. داده‌محور، سریع و قابل اعتماد برای رشد بهتر
              محصولات شما.
            </p>

            <ul className="mt-5 space-y-2">
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircleOutlined className="text-emerald-600" />
                مانیتورینگ زنده دما، رطوبت و نور
              </li>
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircleOutlined className="text-emerald-600" />
                کنترل خودکار فن‌ها، مه‌پاش و آبیاری
              </li>
              <li className="flex items-center gap-2 text-emerald-800">
                <CheckCircleOutlined className="text-emerald-600" />
                گزارش‌ها و تحلیل‌های دوره‌ای
              </li>
            </ul>

            {/* minimal greenhouse illustration */}
            <svg
              className="mt-6 w-full h-24 sm:h-28 lg:h-32 text-emerald-400/60"
              viewBox="0 0 600 140"
              fill="none"
              aria-hidden="true"
            >
              <path d="M30 110 L300 20 L570 110" stroke="currentColor" strokeWidth="2" />
              <rect x="60" y="70" width="480" height="40" rx="6" stroke="currentColor" strokeWidth="1.5" />
              <path d="M300 20 V110" stroke="currentColor" strokeWidth="1.5" />
              <path d="M150 70 V110 M450 70 V110" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        </section>

        {/* RIGHT: login card */}
        <section className="flex items-center justify-center p-4 sm:p-6 lg:p-10 order-1 lg:order-2 lg:min-h-[80vh]">
          <div className="w-full max-w-md md:max-w-lg bg-white/85 backdrop-blur-md border border-emerald-100 rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mx-auto mb-3 flex items-center justify-center">
              <div className="h-14 w-14 rounded-full bg-emerald-100 ring-1 ring-emerald-200 grid place-items-center text-emerald-700">
                <EnvironmentOutlined />
              </div>
            </div>

            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-emerald-900">ورود به حساب کاربری</h2>
              <p className="text-sm text-emerald-700 mt-1">سامانه مدیریت گلخانه • خوش آمدید</p>

              <div className="flex flex-wrap justify-center gap-2 mt-3">
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  کنترل دما
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  آبیاری هوشمند
                </span>
                <span className="px-3 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  رطوبت‌سنج
                </span>
              </div>
            </div>

            <Divider className="my-4" />

            <Form
              layout="vertical"
              onFinish={handleSubmit}
              validateTrigger={["onBlur", "onSubmit"]}
              requiredMark={false}
              scrollToFirstError
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "نام کاربری را وارد کنید!" },
                  { min: 3, message: "حداقل ۳ کاراکتر" },
                ]}
                hasFeedback
              >
                <Input
                  size="large"
                  dir="rtl"
                  className="h-11 text-right transition-all"
                  placeholder="نام کاربری"
                  autoComplete="username"
                  allowClear
                  autoFocus
                  disabled={loading}
                  prefix={<UserOutlined className="text-gray-400" />}
                  onFocus={() => setTyping((t) => ({ ...t, username: true }))}
                  onChange={(e) => {
                    const hasValue = e.target.value.length > 0;
                    setTyping((t) => ({ ...t, username: hasValue }));
                    setDirty((d) => ({ ...d, username: hasValue }));
                    setEditedAfterError((s) => ({ ...s, username: true })); // mark edited after error
                    setError(null); // clear general error on input change
                  }}
                  onBlur={() => setTyping((t) => ({ ...t, username: false }))}
                  style={
                    authError && !editedAfterError.username
                      ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.15)" }
                      : typing.username || dirty.username
                      ? { borderColor: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.15)" }
                      : undefined
                  }
                />
              </Form.Item>

              <Form.Item name="password" rules={[{ required: true, message: "رمز عبور را وارد کنید!" }]} hasFeedback>
                <Input.Password
                  size="large"
                  dir="rtl"
                  className="h-11 text-right transition-all"
                  placeholder="رمز عبور"
                  autoComplete="current-password"
                  allowClear
                  disabled={loading}
                  prefix={<LockOutlined className="text-gray-400" />}
                  onFocus={() => setTyping((t) => ({ ...t, password: true }))}
                  onChange={(e) => {
                    const hasValue = e.target.value.length > 0;
                    setTyping((t) => ({ ...t, password: hasValue }));
                    setDirty((d) => ({ ...d, password: hasValue }));
                    setEditedAfterError((s) => ({ ...s, password: true })); // mark edited after error
                    setError(null); // clear general error on input change
                  }}
                  onBlur={() => setTyping((t) => ({ ...t, password: false }))}
                  style={
                    authError && !editedAfterError.password
                      ? { borderColor: "#ef4444", boxShadow: "0 0 0 3px rgba(239,68,68,0.15)" }
                      : typing.password || dirty.password
                      ? { borderColor: "#10b981", boxShadow: "0 0 0 3px rgba(16,185,129,0.15)" }
                      : undefined
                  }
                />
              </Form.Item>

              <div className="flex items-center justify-between mb-2">
                <Form.Item name="remember" valuePropName="checked" initialValue={false} className="!mb-0">
                  <Checkbox
                    disabled={loading}
                    className={`text-sm flex items-center gap-2 ${authError ? "text-red-600" : ""}`}
                  >
                    <span>مرا به خاطر بسپار</span>
                    <span className="text-[11px] text-emerald-700/80 hidden sm:inline">(برای ورود سریع‌تر)</span>
                  </Checkbox>
                </Form.Item>
                {/* ...existing forgot-password placeholder... */}
              </div>

              <Divider className="my-4" />

              <GreenhouseButton text="ورود" type="submit" loading={loading} className="w-full mt-1" />

              <div className="mt-3 w-full">
                {loading ? (
                  <Alert message="در حال بررسی اطلاعات..." type="info" showIcon />
                ) : error ? (
                  <Alert message={error} type="error" showIcon closable onClose={() => setError(null)} />
                ) : null}
              </div>
            </Form>
          </div>
        </section>
      </div>
    </div>
  );
}
