"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Settings,
  ExternalLink,
  LogOut,
  Menu,
  BarChart2,
  CreditCard,
  UserCircle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/visitas", label: "Visitas", icon: BarChart2 },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/clientes", label: "Clientes", icon: UserCircle },
  { href: "/admin/pagos", label: "Pagos", icon: DollarSign },
  { href: "/admin/membresias", label: "Membresías", icon: CreditCard },
  { href: "/admin/promociones", label: "Promociones", icon: Megaphone },
  { href: "/admin/contenido", label: "Contenido", icon: Settings },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
              isActive && "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            )}
          >
            <item.icon className="size-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();

  const SidebarBody = (
    <>
      <div className="flex items-center gap-2.5 px-4 py-5">
        <Image
          src="/images/brand/logo.jpg"
          alt="Titan's Gym"
          width={36}
          height={36}
          className="size-9 rounded-full object-cover ring-1 ring-border"
        />
        <div>
          <p className="font-heading text-base font-bold uppercase leading-none tracking-tight">
            Titan&apos;s Gym
          </p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>

      <NavLinks pathname={pathname} />

      <div className="mt-auto space-y-1 border-t border-border p-3">
        <Link
          href="/"
          target="_blank"
          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ExternalLink className="size-4.5" />
          Ver sitio
        </Link>
        <p className="truncate px-3 text-xs text-muted-foreground">{adminEmail}</p>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4.5" />
            Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-border bg-card/40 lg:flex">
        {SidebarBody}
      </aside>

      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <span className="font-heading text-lg font-bold uppercase tracking-tight">
          Titan&apos;s Gym <span className="text-primary">Admin</span>
        </span>
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="cursor-pointer" aria-label="Menú" />
            }
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-64 flex-col p-0">
            <SheetTitle className="sr-only">Menú admin</SheetTitle>
            {SidebarBody}
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
