import { useEffect, useState } from "react";
import { X, MessageCircle, Check, Calendar, Send } from "lucide-react";
import { festaApi } from "../lib/api";
import { buildWhatsappLink } from "../lib/format";
import { useFestaConfig } from "../hooks/use-festa-config";
import type { LeadIntent, Project, Unit } from "../lib/types";
import { cn } from "~/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  intent: LeadIntent;
  unit?: Unit | null;
  project?: Project | null;
}

const INTENT_COPY: Record<LeadIntent, { title: string; subtitle: string }> = {
  inquiry: {
    title: "Inquire about this property",
    subtitle: "Leave your details and an advisor will reach out shortly.",
  },
  "site-visit": {
    title: "Book a site visit",
    subtitle: "Pick a date and we'll arrange a private viewing for you.",
  },
  booking: {
    title: "Book this unit",
    subtitle: "Reserve now — an advisor will confirm and guide you through booking.",
  },
};

export function LeadCaptureModal({ open, onClose, intent, unit, project }: Props) {
  const { config } = useFestaConfig();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setDone(false);
      setError("");
    }
  }, [open, intent]);

  if (!open) return null;

  const copy = INTENT_COPY[intent];
  const contextLabel = unit
    ? `${unit.name}${project ? ` · ${project.name}` : ""}`
    : project?.name;

  const waMessage = `Hi ${config.agentName}, I'm interested in ${
    contextLabel ?? "a property on " + config.appName
  }. ${intent === "site-visit" ? "I'd like to book a site visit." : intent === "booking" ? "I'd like to book this unit." : "Could you share more details?"}`;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !phone.trim()) {
      setError("Please enter your name and phone number.");
      return;
    }
    setSubmitting(true);
    const res = await festaApi.createLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      message: message.trim() || undefined,
      intent,
      projectId: project?._id || unit?.projectId,
      projectName: project?.name,
      unitId: unit?._id,
      unitName: unit?.name,
      preferredDate: preferredDate || undefined,
    });
    setSubmitting(false);
    if (res.success) {
      setDone(true);
    } else {
      setError(res.message || "Something went wrong. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="relative w-full max-w-lg rounded-t-3xl bg-card shadow-2xl sm:rounded-3xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <div className="px-6 py-12 text-center sm:px-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">You're all set!</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Thanks {name.split(" ")[0]} — your request is in. {config.agentName} will reach out
              soon. Want to talk now?
            </p>
            <a
              href={buildWhatsappLink(config.agentWhatsapp, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              {config.whatsappCtaLabel}
            </a>
          </div>
        ) : (
          <div className="px-6 py-7 sm:px-8">
            <div className="mb-5 pr-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {intent === "site-visit" ? "Schedule" : intent === "booking" ? "Reserve" : "Inquire"}
              </p>
              <h3 className="mt-1 text-xl font-bold text-foreground">{copy.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{copy.subtitle}</p>
              {contextLabel && (
                <div className="mt-3 rounded-xl bg-secondary px-3 py-2 text-sm font-medium text-foreground">
                  {contextLabel}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Field label="Full name" required>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="festa-input"
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Phone" required>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+62 8xx xxxx"
                    className="festa-input"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="festa-input"
                  />
                </Field>
              </div>
              {intent === "site-visit" && (
                <Field label="Preferred date">
                  <div className="relative">
                    <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="festa-input pl-10"
                    />
                  </div>
                </Field>
              )}
              <Field label="Message">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={2}
                  placeholder="Anything you'd like us to know?"
                  className="festa-input resize-none"
                />
              </Field>

              {error && <p className="text-sm font-medium text-destructive">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className={cn(
                  "mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90",
                  submitting && "opacity-70",
                )}
              >
                <Send className="h-4 w-4" />
                {submitting ? "Sending..." : copy.title}
              </button>

              <a
                href={buildWhatsappLink(config.agentWhatsapp, waMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                <MessageCircle className="h-4 w-4 text-[#25D366]" />
                {config.whatsappCtaLabel}
              </a>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      {children}
    </label>
  );
}
