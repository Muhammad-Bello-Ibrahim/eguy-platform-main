"use client";
import { usePathname } from "next/navigation";
import MobileNav from "@/components/ui/mobile-nav";

export default function MobileNavWrapper() {
  const pathname = usePathname();
  const showMobileNav = (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/elevatex") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/profile")
  );
  return showMobileNav ? <MobileNav /> : null;
}
