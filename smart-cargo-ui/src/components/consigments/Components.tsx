import { statusCfg } from "../../data/mockData";



// ─── StatusBadge ─────────────────────────────────────────
// status prop must be one of backend enum: CREATED | DISPATCHED | ARRIVED | COMPLETED
export function StatusBadge({ status }: { status: string }) {
  const c = statusCfg[status] ?? {
    bg: "bg-gray-100", text: "text-gray-500", dot: "bg-gray-400", label: status,
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ─── WeightBar ───────────────────────────────────────────
// Props match backend fields: total_weight_kg / capacity_kg
export function WeightBar({ weight, capacity }: { weight: number; capacity: number }) {
  const pct = Math.min(Math.round((weight / capacity) * 100), 100);
  const bar = pct > 90 ? "bg-red-500" : pct > 70 ? "bg-amber-500" : "bg-orange-500";
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className={`h-full rounded-full ${bar}`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-700">{weight} kg</span>
      </div>
      <span className="text-[10px] text-gray-400">{pct}% of {capacity.toLocaleString()} kg</span>
    </div>
  );
}

// ─── SectionTitle ────────────────────────────────────────
export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest whitespace-nowrap">
        {children}
      </span>
      <div className="flex-1 h-px bg-orange-100" />
    </div>
  );
}

// ─── FormGroup ───────────────────────────────────────────
export function FormGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────
export function Toast({
  msg, type, visible,
}: {
  msg: string;
  type: "success" | "warning";
  visible: boolean;
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-[999] flex items-center gap-2.5 px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-medium shadow-2xl transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type === "success" ? "bg-green-400" : "bg-orange-400"}`} />
      {msg}
    </div>
  );
}