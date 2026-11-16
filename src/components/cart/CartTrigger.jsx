import { useSyncExternalStore } from "react";
import { ArrowUpRight, Mail, ShoppingBag, Trash2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cartTotal, interestList } from "@/lib/cart";
import { formatCLP } from "@/lib/format";

export default function CartTrigger() {
  const items = useSyncExternalStore(
    interestList.subscribe,
    interestList.getSnapshot,
    interestList.getServerSnapshot,
  );

  const total = cartTotal(items);
  const mailtoHref = () => {
    const subject = encodeURIComponent(
      `Solicitud de compra — ${items.map((item) => item.title).join(", ")}`,
    );
    const lines = items.map(
      (item) => `· ${item.title} (${item.format}) — ${formatCLP(item.price)}`,
    );
    const body = encodeURIComponent(
      [
        "Hola Revista Micelio,",
        "",
        "Quisiera consultar disponibilidad y coordinar la compra de:",
        "",
        ...lines,
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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full p-2 opacity-82 transition duration-300 hover:bg-current/8 hover:opacity-100"
          aria-label="Abrir lista de interés"
        >
          <ShoppingBag
            className="size-4"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          {items.length > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-purple font-mono text-nano font-medium text-paper">
              {items.length}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-full gap-0 border-line bg-paper p-0 text-ink sm:max-w-md"
        showCloseButton={false}
      >
        <SheetHeader className="flex-row items-start justify-between gap-4 border-b border-line px-6 py-6">
          <div>
            <p className="eyebrow mb-2 text-forest-700">Tu selección</p>
            <SheetTitle className="type-display text-4xl">
              Lista de interés
            </SheetTitle>
            <SheetDescription className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
              No es un carrito de pago. Envía tu solicitud y coordinamos
              disponibilidad y despacho por correo.
            </SheetDescription>
          </div>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" aria-label="Cerrar lista">
              <X className="size-5" strokeWidth={1.5} />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length === 0 ? (
            <div className="flex h-full min-h-70 flex-col items-start justify-center py-12">
              <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-line">
                <ShoppingBag
                  className="size-6 text-forest-700"
                  strokeWidth={1.3}
                  aria-hidden="true"
                />
              </div>
              <p className="font-display text-2xl leading-tight">
                Tu lista está vacía.
              </p>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                Guarda ediciones y guías mientras exploras, y envíanos una
                solicitud cuando estés listo.
              </p>
              <SheetClose asChild>
                <a href="/ediciones" className="btn btn--forest mt-6">
                  Explorar ediciones
                  <ArrowUpRight
                    className="size-4"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  />
                </a>
              </SheetClose>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.id} className="flex items-start gap-4 py-5">
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-xl leading-tight">
                      {item.title}
                    </p>
                    <p className="mt-1 font-mono text-micro uppercase tracking-widest text-muted-foreground">
                      {item.format}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {formatCLP(item.price)}
                    </p>
                    <a
                      href="/#contacto"
                      className="mt-2 inline-flex items-center gap-1 font-mono text-eyebrow uppercase tracking-widest text-forest-700 underline underline-offset-2"
                    >
                      Consultar disponibilidad
                      <ArrowUpRight
                        className="size-3"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => interestList.remove(item.id)}
                    className="mt-1 text-muted-foreground transition-colors hover:text-destructive"
                    aria-label={`Quitar ${item.title} de la lista`}
                  >
                    <Trash2 className="size-4" strokeWidth={1.5} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="mt-0 gap-3 border-t border-line bg-bone/50 p-6">
            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-tiny uppercase tracking-editorial text-muted-foreground">
                Total referencial
              </span>
              <span className="font-display text-2xl">{formatCLP(total)}</span>
            </div>
            <a href={mailtoHref()} className="btn btn--forest w-full">
              <Mail className="size-4" strokeWidth={1.5} aria-hidden="true" />
              Solicitar por correo
            </a>
            <div className="flex items-center justify-between gap-3">
              <a
                href="/#contacto"
                className="text-xs text-muted-foreground underline underline-offset-2 hover:text-ink"
              >
                Consultar disponibilidad
              </a>
              <button
                type="button"
                onClick={() => interestList.clear()}
                className="font-mono text-eyebrow uppercase tracking-widest text-muted-foreground hover:text-destructive"
              >
                Vaciar
              </button>
            </div>
            <p className="text-tiny leading-relaxed text-muted-foreground">
              Este sitio no procesa pagos. La compra se confirma por correo con
              el equipo editorial.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
