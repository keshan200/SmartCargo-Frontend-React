import React, { useEffect, useRef } from "react";

import { PKG_OPTIONS, SERVICE_OPTIONS, PAYMENT_OPTIONS, inp } from "././Constants";
import type { ShipmentForm } from "../../types/shipment";
import { HubSelector } from "./Hubselector";
import { useGeocode } from "./Utils";
import { Icon, Label, Row, Sel } from "./Ui";

// ─── Step Bar ─────────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: "Receiver",  icon: <Icon.User /> },
  { id: 2, label: "Package",   icon: <Icon.Package /> },
  { id: 3, label: "Logistics", icon: <Icon.Pin /> },
  { id: 4, label: "Payment",   icon: <Icon.Card /> },
];

export const StepBar = ({ current }: { current: number }) => (
  <div className="flex items-center justify-center gap-0 mb-6">
    {STEPS.map((s, i) => (
      <div key={s.id} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all ${
            current === s.id
              ? "bg-orange-500 text-white shadow shadow-orange-200"
              : current > s.id
              ? "bg-orange-100 text-orange-500"
              : "bg-gray-100 text-gray-400"
          }`}>
            {current > s.id ? <Icon.Check /> : s.icon}
          </div>
          <span className={`text-[10px] mt-1 font-medium ${
            current === s.id ? "text-orange-500" : current > s.id ? "text-orange-300" : "text-gray-400"
          }`}>{s.label}</span>
        </div>
        {i < STEPS.length - 1 && (
          <div className={`w-10 h-px mx-1 mb-4 ${current > s.id ? "bg-orange-300" : "bg-gray-200"}`} />
        )}
      </div>
    ))}
  </div>
);

// ─── Step 1 — Receiver Info ───────────────────────────────────────────────────
export const Step1 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-3">
    <Row>
      <div><Label t="Full Name" req /><input className={inp} placeholder="Nimna Perera" value={f.receiver_name} onChange={e => set("receiver_name", e.target.value)} /></div>
      <div><Label t="Email" req /><input type="email" className={inp} placeholder="nimna@example.com" value={f.receiver_email} onChange={e => set("receiver_email", e.target.value)} /></div>
    </Row>
    <Row>
      <div><Label t="Phone" req /><input type="tel" className={inp} placeholder="077XXXXXXX" value={f.receiver_phone} onChange={e => set("receiver_phone", e.target.value)} /></div>
      <div><Label t="Postal Code" req /><input className={inp} placeholder="20000" value={f.receiver_postal_code} onChange={e => set("receiver_postal_code", e.target.value)} /></div>
    </Row>
    <Row>
      <div><Label t="City" req /><input className={inp} placeholder="Kandy" value={f.receiver_city} onChange={e => set("receiver_city", e.target.value)} /></div>
      <div><Label t="Address" req /><input className={inp} placeholder="No 25, Peradeniya Road" value={f.receiver_address} onChange={e => set("receiver_address", e.target.value)} /></div>
    </Row>
  </div>
);

// ─── Step 2 — Package Details ─────────────────────────────────────────────────
export const Step2 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-3">
    <Row>
      <div><Label t="Package Type" req /><Sel value={f.package_type} onChange={v => set("package_type", v)} options={PKG_OPTIONS} /></div>
      <div><Label t="Weight (kg)" req /><input type="number" step="0.1" min="0.1" className={inp} placeholder="5.0" value={f.weight_kg} onChange={e => set("weight_kg", e.target.value === "" ? "" : parseFloat(e.target.value))} /></div>
    </Row>
    <div>
      <Label t="Dimensions (cm) — optional" />
      <div className="grid grid-cols-3 gap-2">
        {(["length", "width", "height"] as const).map(d => (
          <div key={d}>
            <p className="text-[10px] text-gray-400 mb-1 capitalize">{d}</p>
            <input
              type="number" min="0" className={inp} placeholder="cm"
              value={f.dimensions[d] === 0 ? "" : f.dimensions[d]}
              onChange={e => set("dimensions", { ...f.dimensions, [d]: e.target.value === "" ? 0 : parseFloat(e.target.value) })}
            />
          </div>
        ))}
      </div>
    </div>
    <div>
      <Label t="Service Type" req />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {SERVICE_OPTIONS.map(o => (
          <button key={o.v} type="button" onClick={() => set("service_type", o.v)}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-center transition-all ${
              f.service_type === o.v ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"
            }`}>
            <span className="text-lg mb-1">{o.emoji}</span>
            <p className={`text-xs font-semibold ${f.service_type === o.v ? "text-orange-600" : "text-gray-700"}`}>{o.label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{o.sub}</p>
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Step 3 — Logistics ───────────────────────────────────────────────────────
export const Step3 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => {
  const addressQuery = [f.receiver_address, f.receiver_city, f.receiver_postal_code].filter(Boolean).join(", ");
  const { result: geoResult, status: geoStatus } = useGeocode(addressQuery);
  const prevGeoRef = useRef<string>("");

  useEffect(() => {
    if (!geoResult) return;
    const key = `${geoResult.lat},${geoResult.lng}`;
    if (key === prevGeoRef.current) return;
    prevGeoRef.current = key;
    set("delivery_lat", parseFloat(geoResult.lat.toFixed(6)));
    set("delivery_lng", parseFloat(geoResult.lng.toFixed(6)));
  }, [geoResult, set]);

  const geoStatusColor: Record<string, string> = { loading: "text-amber-500", done: "text-green-500", error: "text-red-400" };
  const geoStatusLabel: Record<string, string> = { loading: "Locating address…", done: "✓ Address located", error: "Address not found" };

  return (
    <div className="space-y-4">
      <div><Label t="Pickup Hub" req /><HubSelector selectedId={f.current_hub_id} onSelect={id => set("current_hub_id", id)} /></div>
      {geoStatus !== "idle" && (
        <p className={`text-[11px] font-medium ${geoStatusColor[geoStatus] ?? ""}`}>{geoStatusLabel[geoStatus]}</p>
      )}
      <p className="text-xs text-gray-400">Pin the delivery location using the map on the right →</p>
    </div>
  );
};

// ─── Step 4 — Payment & Summary ───────────────────────────────────────────────
export const Step4 = ({ f, set }: { f: ShipmentForm; set: (k: keyof ShipmentForm, v: any) => void }) => (
  <div className="space-y-4">
    <div>
      <Label t="Payment Method" req />
      <div className="grid grid-cols-3 gap-2 mt-1">
        {PAYMENT_OPTIONS.map(pm => (
          <button key={pm.m} type="button" onClick={() => set("payment_method", pm.m)}
            className={`flex flex-col items-center py-3 px-2 rounded-xl border-2 text-center transition-all ${
              f.payment_method === pm.m ? "border-orange-400 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-200"
            }`}>
            <span className="text-xl mb-1">{pm.icon}</span>
            <p className={`text-xs font-semibold leading-tight ${f.payment_method === pm.m ? "text-orange-600" : "text-gray-600"}`}>{pm.label}</p>
          </button>
        ))}
      </div>
    </div>
    <div className="rounded-xl border border-gray-100 overflow-hidden">
      <div className="bg-orange-500 px-4 py-2.5">
        <p className="text-xs font-bold text-white uppercase tracking-wider">Order Summary</p>
      </div>
      <div className="divide-y divide-gray-100">
        {[
          ["Receiver", f.receiver_name || "—"], ["Email", f.receiver_email || "—"], ["Phone", f.receiver_phone || "—"],
          ["City", f.receiver_city || "—"], ["Address", f.receiver_address || "—"], ["Package", f.package_type],
          ["Weight", f.weight_kg !== "" ? `${f.weight_kg} kg` : "—"],
          ["Dimensions", f.dimensions.length ? `${f.dimensions.length}×${f.dimensions.width}×${f.dimensions.height} cm` : "Not set"],
          ["Service", f.service_type], ["Payment", f.payment_method.replace(/_/g, " ")],
        ].map(([k, v]) => (
          <div key={k} className="flex items-center justify-between px-4 py-2.5">
            <span className="text-xs text-gray-400 font-medium">{k}</span>
            <span className="text-xs text-gray-800 font-semibold text-right max-w-[60%] truncate">{v}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);