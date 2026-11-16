import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Check,
  ChevronDown,
  Loader2,
  Send,
} from "lucide-react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { contactEmail, contactReasons, mailtoFor } from "@/lib/contact";

const initialValues = {
  nombre: "",
  email: "",
  motivo: contactReasons[0],
  organizacion: "",
  mensaje: "",
  consentimiento: false,
  website: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fieldClass =
  "h-12 rounded-none border-line bg-paper/80 px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:border-forest-700 focus-visible:ring-forest-700/20 md:text-[0.95rem]";

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle" });
  const [motivoOpen, setMotivoOpen] = useState(false);
  const [motivoActive, setMotivoActive] = useState(0);
  const formRef = useRef(null);
  const motivoTriggerRef = useRef(null);

  const motivoIndex = Math.max(0, contactReasons.indexOf(values.motivo));

  useEffect(() => {
    if (!motivoOpen) return;
    setMotivoActive(motivoIndex);
  }, [motivoOpen, motivoIndex]);

  const selectMotivo = (reason) => {
    setField("motivo", reason);
    setMotivoOpen(false);
    motivoTriggerRef.current?.focus();
  };

  const moveMotivo = (step) => {
    setMotivoActive((current) => {
      const next = current + step;
      if (next < 0) return contactReasons.length - 1;
      if (next >= contactReasons.length) return 0;
      return next;
    });
  };

  const handleMotivoKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!motivoOpen) {
          setMotivoOpen(true);
          setMotivoActive(motivoIndex);
        } else {
          moveMotivo(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!motivoOpen) {
          setMotivoOpen(true);
          setMotivoActive(motivoIndex);
        } else {
          moveMotivo(-1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!motivoOpen) {
          setMotivoOpen(true);
          setMotivoActive(motivoIndex);
        } else {
          selectMotivo(contactReasons[motivoActive] ?? values.motivo);
        }
        break;
      case "Home":
        if (motivoOpen) {
          event.preventDefault();
          setMotivoActive(0);
        }
        break;
      case "End":
        if (motivoOpen) {
          event.preventDefault();
          setMotivoActive(contactReasons.length - 1);
        }
        break;
      case "Escape":
        if (motivoOpen) {
          event.preventDefault();
          setMotivoOpen(false);
        }
        break;
      case "Tab":
        setMotivoOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("motivo");
    if (!requested) return;
    const match = contactReasons.find(
      (reason) => reason.toLowerCase() === requested.trim().toLowerCase(),
    );
    if (match) setValues((current) => ({ ...current, motivo: match }));
  }, []);

  const fallbackHref = useMemo(
    () =>
      mailtoFor(
        `Contacto web — ${values.motivo}`,
        [
          "Hola Revista Micelio,",
          "",
          values.mensaje || "(Escribe aquí tu mensaje)",
          "",
          `Nombre: ${values.nombre || "(no indicado)"}`,
          `Correo: ${values.email || "(no indicado)"}`,
          values.organizacion ? `Organización: ${values.organizacion}` : "",
          "",
          "Enviado desde el formulario de contacto de revistamicelio.cl",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    [values],
  );

  const setField = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    if (status.state === "error") setStatus({ state: "idle" });
  };

  const validate = () => {
    const next = {};
    if (values.nombre.trim().length < 2) next.nombre = "Escribe tu nombre.";
    if (!emailPattern.test(values.email.trim()))
      next.email = "Escribe un correo válido.";
    if (values.mensaje.trim().length < 10)
      next.mensaje = "Cuéntanos un poco más (mínimo 10 caracteres).";
    if (!values.consentimiento)
      next.consentimiento = "Necesitamos tu consentimiento para responderte.";
    return next;
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (status.state === "submitting") return;

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = formRef.current?.querySelector('[aria-invalid="true"]');
      first?.focus();
      setStatus({
        state: "error",
        message: "Revisa los campos marcados antes de enviar.",
        fallback: false,
      });
      return;
    }

    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nombre: values.nombre,
          email: values.email,
          motivo: values.motivo,
          organizacion: values.organizacion,
          mensaje: values.mensaje,
          consentimiento: values.consentimiento,
          website: values.website,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.ok) {
        setValues({ ...initialValues, motivo: values.motivo });
        setStatus({
          state: "success",
          message:
            data.message ||
            "Mensaje enviado. Te responderemos al correo indicado.",
        });
        return;
      }

      const code = data?.code;
      const fallback =
        code === "not_configured" ||
        code === "provider_error" ||
        code === "rate_limited";

      setStatus({
        state: "error",
        code,
        fallback,
        message:
          data?.message ||
          "No pudimos enviar el mensaje. No se registró como enviado. Intenta otra vez.",
      });
    } catch {
      setStatus({
        state: "error",
        code: "network",
        fallback: true,
        message:
          "No hubo conexión con el servidor del formulario. Tu mensaje no se envió. Puedes escribirnos directamente por correo.",
      });
    }
  };

  if (status.state === "success") {
    return (
      <div className="border border-forest-700/30 bg-forest-800 p-8 text-cream sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-full bg-apple text-forest-900">
          <Check className="size-5" strokeWidth={2} aria-hidden="true" />
        </span>
        <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-apple">
          Formulario de contacto
        </p>
        <h2 className="mt-3 font-display text-3xl font-light leading-tight">
          Mensaje enviado.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
          {status.message}
        </p>
        <button
          type="button"
          onClick={() => setStatus({ state: "idle" })}
          className="btn btn--apple mt-7"
        >
          Escribir otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="contact-form">
      <div aria-live="polite" className="sr-only">
        {status.state === "submitting" ? "Enviando mensaje." : ""}
      </div>

      {status.state === "error" && (
        <div
          role="alert"
          className={cn(
            "mb-6 border p-4 text-sm leading-relaxed",
            status.fallback
              ? "border-purple/45 bg-purple/10 text-ink"
              : "border-destructive/40 bg-destructive/5 text-destructive",
          )}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">
                {status.code === "not_configured"
                  ? "El envío automático no está configurado."
                  : status.code === "rate_limited"
                    ? "Demasiados intentos."
                    : "El mensaje no se envió."}
              </p>
              <p className="mt-1 opacity-85">{status.message}</p>
              {status.fallback && (
                <a
                  href={fallbackHref}
                  className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-widest underline underline-offset-4"
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="field">
          <Label htmlFor="contact-nombre" className="field-label">
            Nombre <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="contact-nombre"
            name="nombre"
            autoComplete="name"
            className={fieldClass}
            value={values.nombre}
            onChange={(event) => setField("nombre", event.target.value)}
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={errors.nombre ? "error-nombre" : undefined}
            required
          />
          {errors.nombre && (
            <p id="error-nombre" className="field-error">
              {errors.nombre}
            </p>
          )}
        </div>

        <div className="field">
          <Label htmlFor="contact-email" className="field-label">
            Correo <span aria-hidden="true">*</span>
          </Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={fieldClass}
            value={values.email}
            onChange={(event) => setField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "error-email" : undefined}
            required
          />
          {errors.email && (
            <p id="error-email" className="field-error">
              {errors.email}
            </p>
          )}
        </div>

        <div className="field">
          <Label htmlFor="contact-motivo" className="field-label">
            Motivo <span aria-hidden="true">*</span>
          </Label>
          <PopoverPrimitive.Root
            open={motivoOpen}
            onOpenChange={setMotivoOpen}
            modal={false}
          >
            <PopoverPrimitive.Trigger asChild>
              <button
                ref={motivoTriggerRef}
                type="button"
                id="contact-motivo"
                role="combobox"
                aria-label="Motivo"
                aria-haspopup="listbox"
                aria-expanded={motivoOpen}
                aria-required="true"
                aria-controls={motivoOpen ? "contact-motivo-listbox" : undefined}
                aria-activedescendant={
                  motivoOpen
                    ? `contact-motivo-option-${motivoActive}`
                    : undefined
                }
                onKeyDown={handleMotivoKeyDown}
                className={cn(
                  fieldClass,
                  "flex w-full items-center justify-between gap-1.5 border py-1 text-left transition-colors",
                  "focus:border-forest-700 focus:ring-3 focus:ring-forest-700/20",
                  "data-[state=open]:border-forest-700 data-[state=open]:ring-3 data-[state=open]:ring-forest-700/20",
                  "hover:border-forest-700/50"
                )}
              >
                <span className="line-clamp-1">{values.motivo}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    motivoOpen && "rotate-180"
                  )}
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
              </button>
            </PopoverPrimitive.Trigger>
            <PopoverPrimitive.Portal>
              <PopoverPrimitive.Content
                side="bottom"
                align="start"
                sideOffset={4}
                avoidCollisions={false}
                collisionPadding={8}
                onOpenAutoFocus={(event) => event.preventDefault()}
                className="z-50 max-h-[min(15rem,var(--radix-popover-content-available-height))] w-(--radix-popover-trigger-width) overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none"
              >
                <ul
                  id="contact-motivo-listbox"
                  role="listbox"
                  aria-label="Motivo"
                >
                  {contactReasons.map((reason, index) => {
                    const selected = values.motivo === reason;
                    const active = index === motivoActive;
                    return (
                      <li
                        key={reason}
                        id={`contact-motivo-option-${index}`}
                        role="option"
                        aria-selected={selected}
                        onMouseDown={(event) => event.preventDefault()}
                        onMouseEnter={() => setMotivoActive(index)}
                        onClick={() => selectMotivo(reason)}
                        className={cn(
                          "relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none",
                          active
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-bone/60",
                        )}
                      >
                        <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                          {selected && (
                            <Check
                              className="size-4"
                              strokeWidth={1.8}
                              aria-hidden="true"
                            />
                          )}
                        </span>
                        <span>{reason}</span>
                      </li>
                    );
                  })}
                </ul>
              </PopoverPrimitive.Content>
            </PopoverPrimitive.Portal>
          </PopoverPrimitive.Root>
        </div>

        <div className="field">
          <Label htmlFor="contact-organizacion" className="field-label">
            Institución o proyecto{" "}
            <span className="field-optional">(opcional)</span>
          </Label>
          <Input
            id="contact-organizacion"
            name="organizacion"
            autoComplete="organization"
            className={fieldClass}
            value={values.organizacion}
            onChange={(event) => setField("organizacion", event.target.value)}
          />
        </div>
      </div>

      <div className="field mt-5">
        <Label htmlFor="contact-mensaje" className="field-label">
          Mensaje <span aria-hidden="true">*</span>
        </Label>
        <Textarea
          id="contact-mensaje"
          name="mensaje"
          rows={6}
          className={cn(fieldClass, "min-h-40 resize-y py-3")}
          value={values.mensaje}
          onChange={(event) => setField("mensaje", event.target.value)}
          aria-invalid={Boolean(errors.mensaje)}
          aria-describedby={errors.mensaje ? "error-mensaje" : "hint-mensaje"}
          required
        />
        {errors.mensaje ? (
          <p id="error-mensaje" className="field-error">
            {errors.mensaje}
          </p>
        ) : (
          <p id="hint-mensaje" className="field-hint">
            Si escribes por distribución o auspicio, cuéntanos tu territorio o
            marca.
          </p>
        )}
      </div>

      <div className="field mt-5">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
          <input
            type="checkbox"
            name="consentimiento"
            checked={values.consentimiento}
            onChange={(event) =>
              setField("consentimiento", event.target.checked)
            }
            className="mt-0.5 size-4 shrink-0 accent-forest-800"
            aria-invalid={Boolean(errors.consentimiento)}
            aria-describedby={
              errors.consentimiento ? "error-consentimiento" : undefined
            }
            required
          />
          <span>
            Acepto que Revista Micelio use mis datos para responder a esta
            consulta. No se usan para otros fines.
          </span>
        </label>
        {errors.consentimiento && (
          <p id="error-consentimiento" className="field-error">
            {errors.consentimiento}
          </p>
        )}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">No completar este campo</label>
        <input
          id="contact-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(event) => setField("website", event.target.value)}
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="btn btn--forest disabled:cursor-wait disabled:opacity-70"
        >
          {status.state === "submitting" ? (
            <>
              <Loader2
                className="size-4 animate-spin"
                strokeWidth={1.7}
                aria-hidden="true"
              />
              Enviando
            </>
          ) : (
            <>
              <Send className="size-4" strokeWidth={1.7} aria-hidden="true" />
              Enviar
            </>
          )}
        </button>
      </div>

      <p className="mt-4 max-w-lg text-[0.7rem] leading-relaxed text-muted-foreground">
        El formulario envía el mensaje al correo editorial. No procesa pagos ni
        suscripciones automáticas. Si el envío automático no está configurado,
        se mostrará un aviso y el mensaje no se marcará como enviado.
      </p>
    </form>
  );
}
