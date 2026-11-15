const RESEND_ENDPOINT = "https://api.resend.com/emails";

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });

const env = (key) => {
  const fromProcess =
    typeof process !== "undefined" ? process.env?.[key] : undefined;
  const fromMeta = import.meta.env[key];
  return (fromProcess || fromMeta || "").trim();
};

export const mailConfig = () => ({
  apiKey: env("RESEND_API_KEY"),
  from: env("CONTACT_FROM") || "Web Revista Micelio <web@revistamicelio.cl>",
  to: env("CONTACT_TO") || "editorial@revistamicelio.cl",
});

export const mailConfigured = () => Boolean(mailConfig().apiKey);

export async function sendNotification({ subject, text, replyTo }) {
  const { apiKey, from, to } = mailConfig();
  if (!apiKey) {
    return { ok: false, code: "not_configured" };
  }

  try {
    const response = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error(
        "[mail] Resend error",
        response.status,
        detail.slice(0, 300),
      );
      return { ok: false, code: "provider_error" };
    }

    return { ok: true };
  } catch (error) {
    console.error("[mail] request failed", error);
    return { ok: false, code: "provider_error" };
  }
}

/* Simple in-memory limiter. Enough for a single Node instance; replace with a
   shared store (Redis, KV) if the site is deployed across several processes. */
const buckets = new Map();

export function rateLimit(key, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter(
    (stamp) => now - stamp < windowMs,
  );
  if (recent.length >= limit) {
    buckets.set(key, recent);
    return {
      ok: false,
      retryAfter: Math.ceil((windowMs - (now - recent[0])) / 1000),
    };
  }
  recent.push(now);
  buckets.set(key, recent);
  return { ok: true };
}

export const clientKey = (request, fallback) => {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "";
  return ip || fallback;
};

export const clean = (value, max = 4000) =>
  typeof value === "string"
    ? value.replace(/\r\n/g, "\n").trim().slice(0, max)
    : "";
