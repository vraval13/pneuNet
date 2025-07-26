"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Upload,
  Phone,
  Info,
  Microscope,
  MessageCircle,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/predict", label: "Predict", icon: Upload },
    { href: "/contact", label: "Contact", icon: Phone },
    { href: "/about", label: "About", icon: Info },
    { href: "/chatbot", label: "Chatbot", icon: MessageCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-2">
          <Microscope className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">PneumoDetect</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-sm font-medium">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                <span className="flex items-center gap-1">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
