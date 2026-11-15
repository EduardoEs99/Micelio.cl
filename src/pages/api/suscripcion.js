export const prerender = false;

import { z } from "zod";
import {
  clientKey,
  json,
  mailConfigured,
  rateLimit,
  sendNotification,
} from "@/lib/server/notify";

const schema = z.object({
  nombre: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().max(200).pipe(z.email("email")),
  consentimiento: z.literal(true),
  website: z.string().max(0).optional().default(""),
});

export const POST = async ({ request }) => {
  const limited = rateLimit(clientKey(request, "suscripcion"), 3);
  if (!limited.ok) {
    return json(
      {
        ok: false,
        code: "rate_limited",
        message:
          "Recibimos varios intentos desde esta conexión. Intenta nuevamente en unos minutos.",
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
        message: "Revisa tu correo y la casilla de consentimiento.",
      },
      400,
    );
  }

  if (!mailConfigured()) {
    return json(
      {
        ok: false,
        code: "not_configured",
        message:
          "La suscripción automática aún no está configurada en este entorno. Tu correo no quedó registrado.",
        fallbackEmail: "editorial@revistamicelio.cl",
      },
      503,
    );
  }

  const result = await sendNotification({
    subject: `[Web] Nueva suscripción — ${parsed.data.email}`,
    replyTo: parsed.data.email,
    text: [
      "Nueva solicitud de suscripción a novedades de Revista Micelio.",
      "",
      `Nombre: ${parsed.data.nombre || "(no indicado)"}`,
      `Correo: ${parsed.data.email}`,
      `Recibido: ${new Date().toISOString()}`,
      "",
      "El correo aceptó recibir novedades de Revista Micelio desde el sitio web.",
    ].join("\n"),
  });

  if (!result.ok) {
    return json(
      {
        ok: false,
        code: "provider_error",
        message:
          "No pudimos registrar la suscripción. Intenta otra vez o escríbenos directamente.",
        fallbackEmail: "editorial@revistamicelio.cl",
      },
      502,
    );
  }

  return json({
    ok: true,
    message: "Suscripción recibida. Gracias por seguir la red.",
  });
};
