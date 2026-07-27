import Link from "next/link";
import { WalletConnectButton } from "@/components/WalletConnectButton";

const navLinks = [
  { href: "/", label: "Catalogue" },
  { href: "/mint", label: "Mint" },
  { href: "/my-nfts", label: "My Collection" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-graphite">
            BLUEPRINT
          </span>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted sm:inline">
            NFT Registry
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-graphite"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <WalletConnectButton />
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-6 overflow-x-auto border-t border-line px-6 py-2.5 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-graphite"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
