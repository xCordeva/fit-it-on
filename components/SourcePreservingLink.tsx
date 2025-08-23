"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

interface SourcePreservingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export default function SourcePreservingLink({
  href,
  children,
  className,
  ...props
}: SourcePreservingLinkProps) {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  // Preserve the source parameter if it exists
  const finalHref = source ? `${href}?source=${source}` : href;

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  );
}
