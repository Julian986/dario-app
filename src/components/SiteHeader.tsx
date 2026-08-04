import Link from "next/link";

type NavKey = "inicio" | "idea" | "conversacion" | "aplicacion";

const links: { key: NavKey; href: string; label: string; primary?: boolean }[] =
  [
    { key: "idea", href: "/idea", label: "Idea" },
    { key: "conversacion", href: "/conversacion", label: "Conversación" },
    { key: "aplicacion", href: "/app", label: "Aplicación", primary: true },
  ];

export function SiteHeader({ active }: { active?: NavKey }) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[var(--ink)]/8 bg-[var(--paper)] px-4 py-4 md:px-10 md:py-5">
      <Link
        href="/"
        className="shrink-0 font-[family-name:var(--font-display)] text-xl tracking-tight text-[var(--ink)] md:text-2xl"
      >
        Ámbito
      </Link>
      <nav className="flex flex-nowrap items-center justify-end gap-3 text-[15px] text-[var(--muted)] sm:gap-5 md:text-base">
        {links.map((link) => {
          const isActive = active === link.key;
          if (link.primary) {
            return (
              <Link
                key={link.key}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`btn-app relative shrink-0 !px-3 !py-1.5 !text-[15px] !shadow-none sm:!px-4 md:!text-base ${
                  isActive ? "" : "opacity-80"
                }`}
              >
                {link.label}
                {isActive ? (
                  <span
                    aria-hidden
                    className="absolute -bottom-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-[var(--ink)]"
                  />
                ) : null}
              </Link>
            );
          }
          return (
            <Link
              key={link.key}
              href={link.href}
              aria-current={isActive ? "page" : undefined}
              className={`relative shrink-0 whitespace-nowrap pb-1 transition hover:text-[var(--ink)] ${
                isActive
                  ? "font-bold text-[var(--ink)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[3px] after:rounded-full after:bg-[var(--moss)]"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
