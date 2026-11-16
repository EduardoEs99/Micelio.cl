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

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex min-h-10 min-w-10 items-center justify-center gap-1.5 rounded-full p-2 opacity-82 transition duration-300 hover:bg-current/8 hover:opacity-100 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full gap-0 border-0 bg-forest-900 p-0 text-cream sm:max-w-full"
      >
        <div className="flex h-full min-h-dvh flex-col overflow-y-auto">
          <div className="flex items-center justify-between border-b border-cream/15 px-5 py-5">
            <div>
              <p className="font-mono text-eyebrow uppercase tracking-editorial-widest text-apple">
                Revista Micelio
              </p>
              <p className="mt-1 text-xs text-cream/50">
                El universo invisible
              </p>
            </div>
            <SheetClose asChild>
              <button
                type="button"
                className="flex size-11 items-center justify-center rounded-full border border-cream/20 text-cream transition-colors hover:border-apple hover:text-apple"
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
            <ul className="divide-y divide-cream/10">
              {mainLinks.map((link, index) => {
                const active =
                  link.href === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(link.href);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-4"
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="font-mono text-eyebrow tracking-editorial text-apple/70">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-mobile-nav leading-nav tracking-tight transition-colors ${
                          active
                            ? "text-apple"
                            : "text-cream group-hover:text-apple"
                        }`}
                      >
                        {link.label}
                      </span>
                      <ArrowUpRight
                        className="ml-auto size-4 shrink-0 text-cream/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-apple"
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-cream/15 pt-6">
              {revistaLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-1 text-sm text-cream/70 transition-colors hover:text-apple"
                >
                  {link.label}
                </a>
              ))}
              {secondaryLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-1 text-sm text-cream/70 transition-colors hover:text-apple"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="border-t border-cream/15 px-5 py-6">
            <a
              href="/ediciones"
              onClick={() => setOpen(false)}
              className="btn btn--apple w-full justify-between"
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
                    className="flex items-center gap-2 text-xs text-cream/60 transition-colors hover:text-apple"
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
              className="mt-4 block font-mono text-micro tracking-wider text-cream/40 hover:text-apple"
            >
              {email}
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
