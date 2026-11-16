import { useMemo, useState, useSyncExternalStore } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Mail,
  ShoppingBag,
  Trash2,
} from "lucide-react";

import { cartTotal, interestList } from "@/lib/cart";
import { formatCLP } from "@/lib/format";
import "@/styles/components/PageDecor.css";

const buildMailto = (items) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  const subject = encodeURIComponent(
    `Solicitud de compra — ${items.map((item) => item.title).join(", ")}`,
  );
  const body = encodeURIComponent(
    [
      "Hola Revista Micelio,",
      "",
      "Quisiera consultar disponibilidad y coordinar la compra de:",
      "",
      ...items.map(
        (item) => `· ${item.title} (${item.format}) — ${formatCLP(item.price)}`,
      ),
      "",
      `Total referencial: ${formatCLP(total)}`,
      "",
      "Mi nombre:",
      "Mi dirección de despacho (si corresponde):",
      "Comentarios:",
      "",
      "Gracias.",
    ].join("\n"),
  );
  return `mailto:editorial@revistamicelio.cl?subject=${subject}&body=${body}`;
};

const buildPlainSummary = (items) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);
  return [
    "Lista de interés — Revista Micelio",
    "",
    ...items.map(
      (item) => `· ${item.title} (${item.format}) — ${formatCLP(item.price)}`,
    ),
    "",
    `Total referencial: ${formatCLP(total)}`,
    "",
    "Solicitud de compra: editorial@revistamicelio.cl",
    "Contacto: /#contacto",
  ].join("\n");
};

export default function InterestListPage() {
  const items = useSyncExternalStore(
    interestList.subscribe,
    interestList.getSnapshot,
    interestList.getServerSnapshot,
  );
  const [copied, setCopied] = useState(false);
  const total = cartTotal(items);
  const mailtoHref = useMemo(
    () => (items.length ? buildMailto(items) : ""),
    [items],
  );

  const copySummary = async () => {
    if (!items.length) return;
    try {
      await navigator.clipboard.writeText(buildPlainSummary(items));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  };

  if (!items.length) {
    return (
      <section className="bg-paper py-12 lg:py-24" aria-labelledby="cart-empty-title">
        <div className="mx-auto w-full max-w-xl px-5 text-center md:px-8">
          <span className="mb-6 inline-flex size-18 items-center justify-center rounded-full border border-line text-forest-700" aria-hidden="true">
            <ShoppingBag className="size-7" strokeWidth={1.2} />
          </span>
          <p className="eyebrow text-forest-700">Lista de interés</p>
          <h2 id="cart-empty-title" className="type-display mt-3.5 text-cart-empty text-forest-800">
            Todavía no has
            <br />
            <span className="italic font-light text-forest-700">guardado nada.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-copy-sm leading-relaxed text-muted-foreground">
            Guarda ediciones, packs y guías mientras exploras el catálogo.
            Después puedes enviarnos la lista por correo y coordinamos
            disponibilidad, despacho y pago con el equipo editorial.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a href="/ediciones" className="btn btn--forest">
              Explorar ediciones
              <ArrowRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
            <a href="/red-micelio" className="btn btn--outline">
              Ver guías de funga
            </a>
          </div>
          <p className="mt-7 text-tiny text-muted-foreground">
            ¿Prefieres consultar directo?{" "}
            <a href="/#contacto" className="text-forest-700 underline underline-offset-2">
              Consultar disponibilidad
              <ArrowUpRight
                className="ml-0.5 inline size-3"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-paper py-10 lg:py-18" aria-labelledby="cart-list-title">
      <div className="container-editorial grid grid-cols-1 items-start gap-10 split:grid-cols-12 split:gap-20">
        <div className="split:col-span-8">
          <div className="border-b border-line pb-6 lg:pb-9">
            <p className="eyebrow text-forest-700">Tu selección</p>
            <h2 id="cart-list-title" className="type-display mt-3.5 text-cart-count text-forest-800">
              {items.length} {items.length === 1 ? "título" : "títulos"}
              <span className="italic font-light text-forest-700"> en tu lista</span>
            </h2>
            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Revisa lo que guardaste. Enviar la lista abre un correo con el
              detalle; no es una compra confirmada ni un pago.
            </p>
          </div>

          <ol className="divide-y divide-forest-800/14">
            {items.map((item, index) => (
              <li key={item.id} className="flex gap-2.5 py-6 grid:gap-5 grid:py-8">
                <span className="w-9 shrink-0 pt-1.5 font-mono text-eyebrow tracking-widest text-forest-700 grid:w-14" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
                    <div>
                      <h3 className="font-display text-cart-item font-normal leading-tight tracking-tight text-forest-800">{item.title}</h3>
                      <p className="mt-1.5 font-mono text-eyebrow uppercase tracking-editorial text-muted-foreground">{item.format}</p>
                    </div>
                    <p className="font-display text-cart-price tabular-nums text-forest-800">{formatCLP(item.price)}</p>
                  </div>
                  <div className="mt-3.5 flex flex-wrap items-center gap-5">
                    <a href="/#contacto" className="inline-flex items-center gap-1.5 font-mono text-nano uppercase tracking-widest text-forest-700 underline underline-offset-4 hover:text-purple">
                      Consultar disponibilidad
                      <ArrowUpRight
                        className="size-3.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                    <button
                      type="button"
                      onClick={() => interestList.remove(item.id)}
                      className="inline-flex items-center gap-1.5 font-mono text-nano uppercase tracking-widest text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Quitar ${item.title} de la lista`}
                    >
                      <Trash2
                        className="size-3.5"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      Quitar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6">
            <button
              type="button"
              onClick={() => interestList.clear()}
              className="inline-flex items-center gap-1.5 font-mono text-nano uppercase tracking-editorial text-muted-foreground transition-colors hover:text-destructive"
            >
              Vaciar lista
            </button>
            <a href="/ediciones" className="inline-flex items-center gap-1.5 font-mono text-nano uppercase tracking-editorial text-forest-800 transition-colors hover:text-purple">
              Seguir explorando
              <ArrowRight
                className="size-3.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <aside className="cart-summary overflow-hidden p-7 text-cream split:sticky split:top-26 split:col-span-4 lg:p-10" aria-labelledby="cart-summary-title">
          <p className="eyebrow text-apple">Resumen</p>
          <h3
            id="cart-summary-title"
            className="type-display mt-4 text-cart-summary text-cream"
          >
            Coordinemos
            <br />
            <span className="italic font-light text-apple">la compra.</span>
          </h3>

          <dl className="mt-7 flex flex-col gap-2.5 border-y border-cream/18 py-5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-mono text-eyebrow uppercase tracking-editorial text-cream/52">Títulos</dt>
              <dd className="text-copy tabular-nums text-cream">{items.length}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4">
              <dt className="font-mono text-eyebrow uppercase tracking-editorial text-cream/52">Total referencial</dt>
              <dd className="font-display text-cart-total text-apple">{formatCLP(total)}</dd>
            </div>
          </dl>

          <p className="mt-4 text-tiny leading-relaxed text-cream/52">
            El total es referencial: no incluye despacho y puede variar según
            disponibilidad. La compra se confirma por correo.
          </p>

          <a href={mailtoHref} className="btn btn--apple mt-5 w-full">
            <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Solicitar por correo
          </a>

          <button
            type="button"
            onClick={copySummary}
            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full border border-cream/25 px-4 py-2.5 font-mono text-eyebrow uppercase tracking-widest text-cream transition-colors duration-300 hover:border-apple hover:text-apple"
          >
            {copied ? (
              <>
                <Check
                  className="size-3.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                Resumen copiado
              </>
            ) : (
              <>
                <Copy
                  className="size-3.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Copiar resumen
              </>
            )}
            <span aria-live="polite" className="sr-only">
              {copied ? "Resumen copiado al portapapeles" : ""}
            </span>
          </button>

          <a href="/#contacto" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 text-tiny text-cream/66 underline underline-offset-4 transition-colors hover:text-apple">
            Consultar disponibilidad
            <ArrowUpRight
              className="size-3.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </a>

          <div className="mt-6 flex gap-2.5 border-t border-cream/14 pt-5">
            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-purple" aria-hidden="true" />
            <p className="text-tiny leading-relaxed text-cream/52">
              <strong className="font-medium text-cream">Pago no habilitado en este sitio.</strong> No procesamos
              tarjetas ni emitimos boletas aquí. El correo editorial es el canal
              real.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
