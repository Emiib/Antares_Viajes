import { useEffect, useState } from "react";
import type { RouteKey } from "../types";

export function getRouteFromHash(hash: string): RouteKey {
  const cleaned = hash.replace("#", "").split("/")[0];
  if (cleaned === "ofertas") return "ofertas";
  if (cleaned === "argentina") return "argentina";
  if (cleaned === "quinceaneras") return "quinceaneras";
  if (cleaned === "experiencias") return "experiencias";
  if (cleaned === "cruceros") return "cruceros";
  if (cleaned === "blog") return "blog";
  if (cleaned === "infoUtil") return "infoUtil";
  if (cleaned === "legales") return "legales";
  if (cleaned === "grupales") return "grupales";
  if (cleaned === "circuitos") return "circuitos";
  if (cleaned === "package-detail") return "package-detail";
  if (cleaned === "admin") return "admin";
  return "home";
}

export function useHashRoute() {
  const [route, setRoute] = useState<RouteKey>(() =>
    getRouteFromHash(window.location.hash),
  );
  const [packageId, setPackageId] = useState<string | null>(() => {
    const hash = window.location.hash.replace("#", "");
    const parts = hash.split("/");
    return parts[0] === "package-detail" ? parts[1] || null : null;
  });

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash.replace("#", "");
      setRoute(getRouteFromHash(window.location.hash));
      const parts = hash.split("/");
      setPackageId(parts[0] === "package-detail" ? parts[1] || null : null);
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  return { route, packageId };
}