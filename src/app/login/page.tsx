"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useEffect, Suspense } from "react";
import { Loader2 } from "lucide-react";

// 1. Zod Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // 3. TanStack Query Mutation
  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data || "Failed to log in. Check your credentials.";
      toast.error(errorMsg);
    },
  });

  // 4. Guest Login Watcher
  useEffect(() => {
    const isGuest = searchParams.get("guest") === "true";
    if (isGuest) {
      const guestCredentials = {
        email: "demo@traceback.com",
        password: "password123",
      };
      
      // Fill the form and submit automatically
      setValue("email", guestCredentials.email);
      setValue("password", guestCredentials.password);
      
      toast.loading("Accessing as Guest...", { duration: 2000 });
      loginMutation.mutate(guestCredentials);
    }
  }, [searchParams, setValue]);

  // 5. The Submit Handler
  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">

      {loginMutation.isPending && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="mt-4 font-bold text-slate-700 uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      )}

      <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-10 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm font-medium text-gray-500">
            Sign in to your Traceback account.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="block w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="name@example.com"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="block w-full rounded-xl border border-gray-200 bg-slate-50 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                placeholder="••••••••"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs font-bold text-red-500 ml-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative flex w-full justify-center rounded-xl bg-blue-600 px-4 py-4 text-sm font-black uppercase tracking-widest text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400 transition-all shadow-lg shadow-blue-100"
            >
              {loginMutation.isPending ? "Connecting..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-gray-500 font-medium">Don't have an account? </span>
          <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition">
            Create one for free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}