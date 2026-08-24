"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

type ActiveLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: () => void;
};

export function ActiveLink({ href, children, className = "", activeClassName = "metro-active", onClick }: ActiveLinkProps) {
  const pathname = usePathname();
  const clean = href.split("?")[0].split("#")[0];
  const isHash = href.includes("#");
  const isActive = isHash
    ? false
    : clean === "/"
      ? pathname === "/"
      : pathname.startsWith(clean);
  return (
    <Link href={href} className={`${className} ${isActive ? activeClassName : ""}`} onClick={onClick}>
      {children}
    </Link>
  );
}
