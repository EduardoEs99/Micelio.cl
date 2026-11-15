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
      <section className="cart-empty" aria-labelledby="cart-empty-title">
        <div className="cart-empty__inner">
          <span className="cart-empty__mark" aria-hidden="true">
            <ShoppingBag className="size-7" strokeWidth={1.2} />
          </span>
          <p className="eyebrow text-forest-700">Lista de interés</p>
          <h2 id="cart-empty-title" className="type-display cart-empty__title">
            Todavía no has
            <br />
            <span className="italic">guardado nada.</span>
          </h2>
          <p className="cart-empty__text">
            Guarda ediciones, packs y guías mientras exploras el catálogo.
            Después puedes enviarnos la lista por correo y coordinamos
            disponibilidad, despacho y pago con el equipo editorial.
          </p>
          <div className="cart-empty__actions">
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
          <p className="cart-empty__note">
            ¿Prefieres consultar directo?{" "}
            <a href="/#contacto" className="underline underline-offset-2">
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
    <section className="cart-page" aria-labelledby="cart-list-title">
      <div className="container-editorial cart-page__grid">
        <div className="cart-page__main">
          <div className="cart-page__heading">
            <p className="eyebrow text-forest-700">Tu selección</p>
            <h2 id="cart-list-title" className="type-display cart-page__count">
              {items.length} {items.length === 1 ? "título" : "títulos"}
              <span className="cart-page__count-note"> en tu lista</span>
            </h2>
            <p className="cart-page__intro">
              Revisa lo que guardaste. Enviar la lista abre un correo con el
              detalle; no es una compra confirmada ni un pago.
            </p>
          </div>

          <ol className="cart-list">
            {items.map((item, index) => (
              <li key={item.id} className="cart-item">
                <span className="cart-item__number" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="cart-item__body">
                  <div className="cart-item__top">
                    <div>
                      <h3 className="cart-item__title">{item.title}</h3>
                      <p className="cart-item__format">{item.format}</p>
                    </div>
                    <p className="cart-item__price">{formatCLP(item.price)}</p>
                  </div>
                  <div className="cart-item__actions">
                    <a href="/#contacto" className="cart-item__link">
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
                      className="cart-item__remove"
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

          <div className="cart-page__foot">
            <button
              type="button"
              onClick={() => interestList.clear()}
              className="cart-clear"
            >
              Vaciar lista
            </button>
            <a href="/ediciones" className="cart-continue">
              Seguir explorando
              <ArrowRight
                className="size-3.5"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <aside className="cart-summary" aria-labelledby="cart-summary-title">
          <p className="eyebrow text-apple">Resumen</p>
          <h3
            id="cart-summary-title"
            className="type-display cart-summary__title"
          >
            Coordinemos
            <br />
            <span className="italic">la compra.</span>
          </h3>

          <dl className="cart-summary__rows">
            <div>
              <dt>Títulos</dt>
              <dd>{items.length}</dd>
            </div>
            <div>
              <dt>Total referencial</dt>
              <dd className="cart-summary__total">{formatCLP(total)}</dd>
            </div>
          </dl>

          <p className="cart-summary__note">
            El total es referencial: no incluye despacho y puede variar según
            disponibilidad. La compra se confirma por correo.
          </p>

          <a href={mailtoHref} className="btn btn--apple cart-summary__cta">
            <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
            Solicitar por correo
          </a>

          <button
            type="button"
            onClick={copySummary}
            className="cart-summary__copy"
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

          <a href="/#contacto" className="cart-summary__store">
            Consultar disponibilidad
            <ArrowUpRight
              className="size-3.5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </a>

          <div className="cart-summary__status">
            <span className="cart-summary__dot" aria-hidden="true" />
            <p>
              <strong>Pago no habilitado en este sitio.</strong> No procesamos
              tarjetas ni emitimos boletas aquí. El correo editorial es el canal
              real.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
