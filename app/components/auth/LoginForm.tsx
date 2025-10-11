"use client";
import "@ant-design/v5-patch-for-react-19";

import PrimaryButton from "../UI/Button";
import { Checkbox, Divider, Form, Input } from "antd";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/app/lib/auth";

export default function Login() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const route = useRouter();

  const handleSubmit = async (values: { username: string; password: string; remember: boolean }) => {
    setLoading(true);
    setError(null);
    const res = await signIn(values);

    if (res?.status === "error") {
      setError(res.message || "خطایی رخ داده است. لطفا دوباره تلاش کنید.");
      setLoading(false);
      return;
    }

    if (res?.status === "ok") {
      setLoading(false);
      route.push("/dashboard");
    }
  };

  return (
    <div className="bg-white min-h-[350px] p-6 rounded shadow-md w-80">
      <Form onFinish={handleSubmit}>
        <h2 className="w-full text-center text-xl mb-4">ورود به حساب کاربری</h2>
        <Divider />
        <Form.Item name="username" rules={[{ required: true, message: "نام کاربری را وارد کنید!" }]}>
          <Input type="text" placeholder="نام کاربری" className="h-[35px]" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: "رمز عبور را وارد کنید!" }]}>
          <Input type="password" placeholder="رمز عبور" className="h-[35px]" />
        </Form.Item>
        <Form.Item name="remember" valuePropName="checked" initialValue={false}>
          <Checkbox className="text-sm">مرا به خاطر بسپار</Checkbox>
        </Form.Item>
        <Divider />
        <PrimaryButton text="ورود" type="submit" className="w-full mt-2" />
        <div className="mt-2 w-full text-center">
          {loading ? "..." : error ? <span className="text-red-500 text-sm">{error}</span> : null}
        </div>
      </Form>
    </div>
  );
}
