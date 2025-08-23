"use client";

import { useSearchParams } from "next/navigation";

export function useSourceParameter() {
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  const isFromExtension = source === "extension";

  const getRedirectPath = () => {
    return isFromExtension ? "/auth-success" : "/studio";
  };

  const preserveSourceInUrl = (baseUrl: string) => {
    return source ? `${baseUrl}?source=${source}` : baseUrl;
  };

  return {
    source,
    isFromExtension,
    getRedirectPath,
    preserveSourceInUrl,
  };
}
