import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, Truck, RotateCcw, Ruler } from "lucide-react";
import { Button } from "@/components/lux/Button";
import { useToast } from "@/components/lux/Toast";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
});

function ContactPage() {
  const toast = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.subject.trim()) errs.subject = "Subject is required";
    if (!form.message.trim()) errs.message = "Message is required";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    toast("Message sent — we'll get back to you within 24 hours");
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const inputClass = (field: string) =>
    `w-full rounded-md border bg-background px-4 py-2.5 text-[13px] placeholder:text-muted focus:outline-none ${
      errors[field] ? "border-destructive" : "border-border focus:border-foreground/30"
    }`;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-10">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Get in touch</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
          Questions about an order, a product, or anything else? We're here to help.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="rounded-lg border border-border bg-surface p-6">
          <h2 className="mb-5 font-display text-xl">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[12px] text-muted">Name *</label>
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={inputClass("name")}
                  placeholder="Your name"
                />
                {errors.name && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.name}</p>
                )}
              </div>
              <div>
                <label className="text-[12px] text-muted">Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className={inputClass("email")}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.email}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[12px] text-muted">Phone</label>
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className={inputClass("phone")}
                  placeholder="9876543210"
                />
              </div>
              <div>
                <label className="text-[12px] text-muted">Subject *</label>
                <input
                  value={form.subject}
                  onChange={(e) => setField("subject", e.target.value)}
                  className={inputClass("subject")}
                  placeholder="Order enquiry"
                />
                {errors.subject && (
                  <p className="mt-1 text-[11px] text-destructive">{errors.subject}</p>
                )}
              </div>
            </div>
            <div>
              <label className="text-[12px] text-muted">Message *</label>
              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                className={`${inputClass("message")} min-h-[120px] resize-y`}
                placeholder="How can we help?"
              />
              {errors.message && (
                <p className="mt-1 text-[11px] text-destructive">{errors.message}</p>
              )}
            </div>
            <Button type="submit" variant="solid" shape="rounded" size="md">
              <Send size={15} />
              Send Message
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-surface p-6">
            <h2 className="mb-5 font-display text-xl">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@luxora.com" },
                { icon: Phone, label: "Phone", value: "+91 98765 43210" },
                {
                  icon: MapPin,
                  label: "Studio",
                  value: "123 Colaba Causeway, Mumbai 400001, India",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <item.icon size={18} className="mt-0.5 shrink-0 text-primary" />
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.15em] text-muted">
                      {item.label}
                    </p>
                    <p className="mt-1 text-[14px] text-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-4">
              {["Instagram", "Twitter", "Facebook"].map((social) => (
                <a key={social} href="#" className="text-[13px] text-muted hover:text-foreground">
                  {social}
                </a>
              ))}
            </div>
          </div>

          <div className="grid h-48 place-items-center rounded-lg border border-border bg-stone text-muted">
            <div className="text-center">
              <MapPin size={24} className="mx-auto" />
              <p className="mt-2 text-[13px]">Mumbai, India</p>
            </div>
          </div>

          <div id="shipping" className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Truck size={18} className="text-primary" />
              <h3 className="font-display text-lg">Shipping</h3>
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Free shipping on orders above ₹5,000. Standard delivery 3–5 business days. Express
              delivery 1–2 days at ₹500.
            </p>
          </div>
          <div id="returns" className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <RotateCcw size={18} className="text-primary" />
              <h3 className="font-display text-lg">Returns</h3>
            </div>
            <p className="mt-2 text-[13px] text-muted">
              30-day no-questions returns. Items must be unworn with tags attached. Refunds
              processed within 5 business days.
            </p>
          </div>
          <div id="sizing" className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2">
              <Ruler size={18} className="text-primary" />
              <h3 className="font-display text-lg">Size Guide</h3>
            </div>
            <p className="mt-2 text-[13px] text-muted">
              Our pieces fit true to size. If you're between sizes, size down for fitted pieces and
              size up for relaxed cuts. Need help? Send us a message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
