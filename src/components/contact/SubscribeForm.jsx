import { useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  Loader2,
  Mail,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { contactEmail, mailtoFor } from "@/lib/contact";

const fieldClass =
  "h-12 rounded-none border-line bg-paper/80 px-4 text-base shadow-none placeholder:text-muted-foreground/70 focus-visible:border-forest-700 focus-visible:ring-forest-700/20 md:text-base";

export default function SubscribeForm({ context = "novedades" }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState({ state: "idle" });
  const [fieldError, setFieldError] = useState("");
  const formRef = useRef(null);

  const fallbackHref = useMemo(
    () =>
      mailtoFor(
        "Suscripción a novedades — Revista Micelio",
        [
          "Hola Revista Micelio,",
          "",
          `Quiero recibir novedades (${context}).`,
          "",
          `Nombre: ${nombre || "(no indicado)"}`,
          `Correo: ${email || "(no indicado)"}`,
        ].join("\n"),
      ),
    [context, email, nombre],
  );

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status.state === "submitting") return;

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
    if (!validEmail) {
      setFieldError("Escribe un correo válido.");
      formRef.current?.querySelector("#subscribe-email")?.focus();
      return;
    }
    if (!consent) {
      setFieldError("Necesitamos tu consentimiento para registrar el correo.");
      return;
    }
    setFieldError("");
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          consentimiento: consent,
          website: honeypot,
        }),
      });
      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setStatus({
          state: "success",
          message:
            data.message || "Suscripción recibida. Gracias por seguir la red.",
        });
        setNombre("");
        setEmail("");
        setConsent(false);
        return;
      }

      const fallback =
        data?.code === "not_configured" ||
        data?.code === "provider_error" ||
        data?.code === "rate_limited";
      setStatus({
        state: "error",
        code: data?.code,
        fallback,
        message:
          data?.message ||
          "No pudimos registrar la suscripción. El correo no quedó guardado. Intenta otra vez.",
      });
    } catch {
      setStatus({
        state: "error",
        code: "network",
        fallback: true,
        message:
          "No hubo conexión con el servidor. El correo no quedó registrado. Puedes escribirnos directamente.",
      });
    }
  };

  if (status.state === "success") {
    return (
      <div className="border border-apple/45 bg-forest-800 p-7 text-cream">
        <span className="flex size-11 items-center justify-center rounded-full bg-apple text-forest-900">
          <Check className="size-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="mt-5 font-display text-2xl leading-tight">
          Suscripción recibida.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-cream/70">
          {status.message}
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="mt-5 font-mono text-eyebrow uppercase tracking-editorial text-apple underline underline-offset-4"
        >
          Suscribir otro correo
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="space-y-4">
      <div aria-live="polite" className="sr-only">
        {status.state === "submitting" ? "Registrando suscripción." : ""}
      </div>

      {status.state === "error" && (
        <div
          role="alert"
          className="border border-purple/45 bg-purple/10 p-4 text-sm leading-relaxed text-ink"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">La suscripción no quedó registrada.</p>
              <p className="mt-1 opacity-85">{status.message}</p>
              {status.fallback && (
                <a
                  href={fallbackHref}
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-eyebrow uppercase tracking-widest underline underline-offset-4"
                >
                  Escribir a {contactEmail}
                  <ArrowUpRight
                    className="size-3.5"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="field">
        <Label htmlFor="subscribe-nombre" className="field-label">
          Nombre <span className="field-optional">(opcional)</span>
        </Label>
        <Input
          id="subscribe-nombre"
          autoComplete="name"
          className={fieldClass}
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
        />
      </div>

      <div className="field">
        <Label htmlFor="subscribe-email" className="field-label">
          Correo <span aria-hidden="true">*</span>
        </Label>
        <Input
          id="subscribe-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          className={cn(fieldClass, fieldError && "border-destructive")}
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            setFieldError("");
          }}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={fieldError ? "subscribe-error" : undefined}
          required
        />
        {fieldError && (
          <p id="subscribe-error" className="field-error">
            {fieldError}
          </p>
        )}
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => {
            setConsent(event.target.checked);
            setFieldError("");
          }}
          className="mt-0.5 size-4 shrink-0 accent-forest-800"
          required
        />
        <span>
          Acepto recibir novedades de Revista Micelio en este correo. Puedo
          pedir la baja escribiendo al correo editorial.
        </span>
      </label>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="subscribe-website">No completar este campo</label>
        <input
          id="subscribe-website"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(event) => setHoneypot(event.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="btn btn--forest w-full disabled:cursor-wait disabled:opacity-70"
      >
        {status.state === "submitting" ? (
          <>
            <Loader2
              className="size-4 animate-spin"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            Registrando
          </>
        ) : (
          <>
            <Mail className="size-4" strokeWidth={1.7} aria-hidden="true" />
            Quiero recibir novedades
          </>
        )}
      </button>

      <p className="text-tiny leading-relaxed text-muted-foreground">
        Sin envíos automáticos si la integración no está configurada: en ese
        caso verás un aviso y podrás escribir al correo editorial.
      </p>
    </form>
  );
}
