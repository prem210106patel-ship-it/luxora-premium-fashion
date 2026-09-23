import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/lux/Button";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password.trim()) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    login(email);
    toast("Welcome back to LUXORA");
    navigate({ to: "/account" });
  };

  const inputClass = (field: string) =>
    cn(
      "w-full rounded-md border bg-background px-4 py-3 pl-11 text-[13px] placeholder:text-muted focus:outline-none",
      errors[field] ? "border-destructive" : "border-border focus:border-foreground/30",
    );

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-16 lg:px-10">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Welcome back</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Sign In</h1>
        <p className="mt-3 text-[14px] text-muted">
          Access your orders, wishlist and saved addresses.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-[12px] text-muted">Email</label>
          <div className="relative mt-1">
            <Mail
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
              className={inputClass("email")}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
        </div>

        <div>
          <label className="text-[12px] text-muted">Password</label>
          <div className="relative mt-1">
            <Lock
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors((p) => ({ ...p, password: "" }));
              }}
              className={inputClass("password")}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-[11px] text-destructive">{errors.password}</p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-[12px] text-muted">
            <input type="checkbox" className="accent-primary" /> Remember me
          </label>
          <button
            type="button"
            onClick={() => toast("Password reset link sent to your email")}
            className="text-[12px] text-muted hover:text-foreground"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" variant="solid" shape="rounded" size="lg" block>
          Sign In
          <ArrowRight size={15} />
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        New to LUXORA?{" "}
        <Link to="/register" className="text-foreground underline hover:text-primary">
          Create an account
        </Link>
      </p>
    </div>
  );
}
