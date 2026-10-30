"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@elsaad/shared";
import { authApi } from "@elsaad/api-client";
import { Lock, Mail, Loader2, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.login(data);
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#151515] border border-[#262626] rounded-xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">لوحة تحكم السعد</h1>
          <p className="text-sm text-[#9CA3AF]">تسجيل الدخول للإدارة ونظام التخطيط</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" dir="rtl">
          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">البريد الإلكتروني</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                {...register("email")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2.5 pr-10 pl-4 text-white text-sm focus:outline-none focus:border-[#E63946] transition-colors"
                placeholder="admin@elsaad.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">كلمة المرور</label>
            <div className="relative">
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#9CA3AF]">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-lg py-2.5 pr-10 pl-4 text-white text-sm focus:outline-none focus:border-[#E63946] transition-colors"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E63946] hover:bg-[#C1121F] text-white font-medium py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
