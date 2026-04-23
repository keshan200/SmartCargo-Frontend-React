import { useState, useEffect, useRef } from "react";
import type { ShipmentForm } from "../../types/shipment";
import { HUB_COORDS, PricingConfig } from "./Constants";


// ─── Haversine ────────────────────────────────────────────────────────────────
export function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ─── Price Calculator ─────────────────────────────────────────────────────────
export function calcPrice(form: ShipmentForm) {
  const w = parseFloat(String(form.weight_kg)) || 0;
  const hubCoord = HUB_COORDS[form.current_hub_id];
  let km = 0;
  if (hubCoord && form.delivery_lat !== null && form.delivery_lng !== null)
    km = haversine(hubCoord.lat, hubCoord.lng, form.delivery_lat, form.delivery_lng);
  const base = PricingConfig.base_price;
  const perKg = w * PricingConfig.price_per_kg;
  const perKm = km * PricingConfig.price_per_km;
  const multiplierApplied = form.service_type === "EXPRESS" || form.service_type === "OVERNIGHT";
  const subtotal = base + perKg + perKm;
  const total = Math.round(multiplierApplied ? subtotal * PricingConfig.express_multiplier : subtotal);
  return { base, perKg: Math.round(perKg), perKm: Math.round(perKm), km: Math.round(km * 10) / 10, total, multiplierApplied };
}

// ─── Geocode hook ─────────────────────────────────────────────────────────────
export type GeoStatus = "idle" | "loading" | "done" | "error";

export function useGeocode(query: string): { result: { lat: number; lng: number } | null; status: GeoStatus } {
  const [result, setResult] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query || query.length < 5) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    setStatus("loading");
    timerRef.current = setTimeout(async () => {
      try {
        const encoded = encodeURIComponent(query + ", Sri Lanka");
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=lk`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data[0]) {
          setResult({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
          setStatus("done");
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    }, 800);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  return { result, status };
}