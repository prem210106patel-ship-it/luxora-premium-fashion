import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/lux/Button";
import { useStore } from "@/store/store";
import { useToast } from "@/components/lux/Toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useStore();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (form.phone && !/^\d{10}$/.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Enter a 10-digit number";
    if (!form.password.trim()) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "At least 6 characters";
    if (form.confirm !== form.password) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    register(form.name, form.email, form.phone || undefined);
    toast("Account created — welcome to LUXORA");
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
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Get started</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Create Account</h1>
        <p className="mt-3 text-[14px] text-muted">
          Join LUXORA for early access, saved sizes and faster checkout.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label className="text-[12px] text-muted">Full name</label>
          <div className="relative mt-1">
            <User
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={inputClass("name")}
              placeholder="Aarav Sharma"
            />
          </div>
          {errors.name && <p className="mt-1 text-[11px] text-destructive">{errors.name}</p>}
        </div>

        <div>
          <label className="text-[12px] text-muted">Email</label>
          <div className="relative mt-1">
            <Mail
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={inputClass("email")}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>}
        </div>

        <div>
          <label className="text-[12px] text-muted">Phone (optional)</label>
          <div className="relative mt-1">
            <Phone
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className={inputClass("phone")}
              placeholder="9876543210"
            />
          </div>
          {errors.phone && <p className="mt-1 text-[11px] text-destructive">{errors.phone}</p>}
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
              value={form.password}
              onChange={(e) => setField("password", e.target.value)}
              className={inputClass("password")}
              placeholder="At least 6 characters"
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

        <div>
          <label className="text-[12px] text-muted">Confirm password</label>
          <div className="relative mt-1">
            <Lock
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => setField("confirm", e.target.value)}
              className={inputClass("confirm")}
              placeholder="Re-enter your password"
            />
          </div>
          {errors.confirm && (
            <p className="mt-1 text-[11px] text-destructive">{errors.confirm}</p>
          )}
        </div>

        <Button type="submit" variant="solid" shape="rounded" size="lg" block>
          Create Account
          <ArrowRight size={15} />
        </Button>
      </form>

      <p className="mt-6 text-center text-[13px] text-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-foreground underline hover:text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
