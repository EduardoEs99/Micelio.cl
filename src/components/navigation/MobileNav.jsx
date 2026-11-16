import { useState } from "react";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const BrandIcon = ({ label }) => {
  if (label === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (label === "YouTube") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
        <path d="m10 9.2 5 2.8-5 2.8Z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return <Mail aria-hidden="true" />;
};

export default function MobileNav({
  currentPath,
  mainLinks,
  revistaLinks,
  secondaryLinks,
  socials,
  email,
}) {
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? currentPath === "/" : currentPath.startsWith(href);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full p-2 text-ink opacity-82 transition duration-300 hover:bg-ink/8 hover:opacity-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-0 border-l border-line bg-paper p-0 text-ink sm:max-w-full"
      >
        <div className="flex h-full min-h-dvh flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-line px-5 py-5">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-editorial-widest text-forest-700">
                Revista Micelio
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                El universo invisible
              </p>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-forest-700 hover:text-forest-700"
                aria-label="Cerrar menú"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </SheetClose>
          </div>

          <SheetTitle className="sr-only">Menú de navegación</SheetTitle>
          <SheetDescription className="sr-only">
            Explora las secciones de Revista Micelio.
          </SheetDescription>

          <nav aria-label="Navegación móvil" className="flex-1 px-5 py-6">
            <ul className="divide-y divide-line">
              {mainLinks.map((link, index) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-4"
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="font-mono text-eyebrow tracking-editorial text-forest-700/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-mobile-nav leading-nav tracking-tight transition-colors ${
                          active
                            ? "text-forest-700"
                            : "text-ink group-hover:text-forest-700"
                        }`}
                      >
                        {link.label}
                      </span>
                      <ArrowUpRight
                        className="ml-auto size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-forest-700"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 border-t border-line pt-6">
              <p className="px-1 pb-3 font-mono text-eyebrow tracking-editorial-wider uppercase text-forest-700">
                La Revista
              </p>
              <ul className="flex flex-col">
                {revistaLinks.map((link, index) => {
                  const active = isActive(link.href);
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`flex gap-3.5 p-3.5 transition-colors duration-250 hover:bg-bone/55 ${
                          active ? "bg-bone/55" : ""
                        }`}
                        aria-current={active ? "page" : undefined}
                      >
                        <span className="mt-1 font-mono text-nano tracking-widest text-forest-700">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <span className="block font-display text-lg leading-tight text-ink">
                            {link.label}
                          </span>
                          <span className="mt-1 block text-xs leading-snug text-muted-foreground">
                            {link.description}
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {secondaryLinks && secondaryLinks.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-6">
                {secondaryLinks.map((link) => {
                  const active = isActive(link.href);
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`py-1 text-sm transition-colors ${
                        active
                          ? "text-forest-700"
                          : "text-muted-foreground hover:text-forest-700"
                      }`}
                      aria-current={active ? "page" : undefined}
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </nav>

          <div className="border-t border-line px-5 py-6">
            <a
              href="/ediciones"
              onClick={() => setOpen(false)}
              className="btn btn--forest w-full justify-between"
            >
              Explorar ediciones
              <ArrowUpRight
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              {socials.map((social) => {
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target={
                      social.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      social.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-forest-700"
                  >
                    <span className="size-3.5 [&_svg]:size-3.5">
                      <BrandIcon label={social.label} />
                    </span>
                    {social.label}
                  </a>
                );
              })}
            </div>
            <a
              href={`mailto:${email}`}
              className="mt-4 block font-mono text-micro tracking-wider text-muted-foreground hover:text-forest-700"
            >
              {email}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}