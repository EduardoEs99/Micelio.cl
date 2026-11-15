export const prerender = false;

import { z } from "zod";
import { contactReasons } from "@/lib/contact";
import {
  clean,
  clientKey,
  json,
  mailConfigured,
  rateLimit,
  sendNotification,
} from "@/lib/server/notify";

const schema = z.object({
  nombre: z.string().trim().min(2, "nombre").max(120),
  email: z.string().trim().max(200).pipe(z.email("email")),
  motivo: z.enum(contactReasons),
  organizacion: z.string().trim().max(160).optional().default(""),
  mensaje: z.string().trim().min(10, "mensaje").max(4000),
  consentimiento: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export const POST = async ({ request }) => {
  const limited = rateLimit(clientKey(request, "contacto"), 5);
  if (!limited.ok) {
    return json(
      {
        ok: false,
        code: "rate_limited",
        message:
          "Recibimos varios envíos desde esta conexión. Intenta nuevamente en unos minutos.",
      },
      429,
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(
      { ok: false, code: "invalid_json", message: "Solicitud inválida." },
      400,
    );
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "invalid",
        message: "Revisa los campos marcados e inténtalo otra vez.",
        fields: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
        })),
      },
      400,
    );
  }

  const data = parsed.data;

  if (!mailConfigured()) {
    return json(
      {
        ok: false,
        code: "not_configured",
        message:
          "El envío automático del formulario aún no está configurado en este entorno. Tu mensaje no se ha enviado.",
        fallbackEmail: "editorial@revistamicelio.cl",
      },
      503,
    );
  }

  const result = await sendNotification({
    subject: `[Web] ${data.motivo} — ${data.nombre}`,
    replyTo: data.email,
    text: [
      "Nuevo mensaje desde el formulario de contacto de revistamicelio.cl",
      "",
      `Nombre: ${data.nombre}`,
      `Correo: ${data.email}`,
      `Motivo: ${data.motivo}`,
      data.organizacion ? `Organización: ${data.organizacion}` : "",
      "",
      "Mensaje:",
      clean(data.mensaje, 4000),
      "",
      `Recibido: ${new Date().toISOString()}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        code: "provider_error",
        message:
          "No pudimos entregar el mensaje al correo editorial. No se envió. Intenta otra vez o escríbenos directamente.",
        fallbackEmail: "editorial@revistamicelio.cl",
      },
      502,
    );
  }

  return json({
    ok: true,
    message: "Mensaje enviado. Te responderemos al correo indicado.",
  });
};

export const GET = () =>
  json(
    {
      ok: false,
      code: "method_not_allowed",
      message: "Usa POST para enviar el formulario de contacto.",
    },
    405,
  );
