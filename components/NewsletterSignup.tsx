/**
 * NewsletterSignup — optional email capture for product updates (demo storage).
 */

"use client";

import { useState, type FormEvent } from "react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list — we'll send therapy tips, not spam.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again later.");
    }
  };

  return (
    <section className="glass rounded-2xl p-6 md:p-8 mt-12 animate-fade-in">
      <div className="max-w-md mx-auto text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-theme-muted mb-2">Optional</p>
        <h2 className="text-lg font-semibold text-theme-primary mb-1">
          Newsletter — repo wellness tips
        </h2>
        <p className="text-sm text-theme-secondary mb-4">
          Get occasional commit-message therapy insights and hackathon updates. Unsubscribe anytime.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={status === "loading" || status === "success"}
            required
            className="flex-1 px-4 py-2.5 rounded-xl bg-theme-input border border-theme-border text-theme-primary placeholder:text-theme-muted focus:outline-none focus:ring-2 focus:ring-fuchsia-400/50 disabled:opacity-50 text-sm"
            aria-label="Email for newsletter"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white text-sm font-semibold hover:from-fuchsia-400 hover:to-purple-500 transition-all disabled:opacity-50 shrink-0"
          >
            {status === "loading" ? "Joining…" : status === "success" ? "Subscribed" : "Subscribe"}
          </button>
        </form>
        {message && (
          <p
            className={`mt-3 text-sm ${status === "error" ? "text-red-500 dark:text-red-300" : "text-emerald-600 dark:text-emerald-300"}`}
            role="status"
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}
