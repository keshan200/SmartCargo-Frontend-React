import React, { useState, useEffect, useCallback } from "react";
import CargoMap from "../components/Map"; // your existing CargoMap component

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "ARRIVING" | "ARRIVED" | "UNLOADING" | "COMPLETED";

interface Consignment {
  id: string;
  vehicle: string;
  vtype: string;
  origin: string;
  dest: string;
  driver: string;
  count: number;
  wt: number;
  cap: number;
  eta: string;
  status: Status;
  gps: boolean;
  routeFrom: { lat: number; lng: number };
  routeTo: { lat: number; lng: number };
  livePos: { lat: number; lng: number };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const DATA: Consignment[] = [
  {
    id: "CON-1001",
    vehicle: "WP-6543",
    vtype: "Truck",
    origin: "Negombo",
    dest: "Colombo",
    driver: "Nimal Silva",
    count: 45,
    wt: 3200,
    cap: 5000,
    eta: "09:30",
    status: "ARRIVING",
    gps: true,
    routeFrom: { lat: 7.2084, lng: 79.8358 },
    routeTo: { lat: 6.9271, lng: 79.8612 },
    livePos: { lat: 7.068, lng: 79.849 },
  },
  {
    id: "CON-1002",
    vehicle: "CP-3312",
    vtype: "Van",
    origin: "Kandy",
    dest: "Colombo",
    driver: "Suresh Perera",
    count: 30,
    wt: 1800,
    cap: 2500,
    eta: "10:15",
    status: "ARRIVED",
    gps: true,
    routeFrom: { lat: 7.2906, lng: 80.6337 },
    routeTo: { lat: 6.9271, lng: 79.8612 },
    livePos: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "CON-1003",
    vehicle: "NW-8821",
    vtype: "Lorry",
    origin: "Galle",
    dest: "Colombo",
    driver: "Rohan Fernando",
    count: 62,
    wt: 4600,
    cap: 5000,
    eta: "11:00",
    status: "UNLOADING",
    gps: false,
    routeFrom: { lat: 6.0535, lng: 80.2209 },
    routeTo: { lat: 6.9271, lng: 79.8612 },
    livePos: { lat: 6.9271, lng: 79.8612 },
  },
  {
    id: "CON-1004",
    vehicle: "SB-4477",
    vtype: "Truck",
    origin: "Jaffna",
    dest: "Colombo",
    driver: "Priya Rajah",
    count: 28,
    wt: 2100,
    cap: 5000,
    eta: "13:30",
    status: "ARRIVING",
    gps: true,
    routeFrom: { lat: 9.6615, lng: 80.0255 },
    routeTo: { lat: 6.9271, lng: 79.8612 },
    livePos: { lat: 8.3, lng: 79.94 },
  },
  {
    id: "CON-1005",
    vehicle: "EP-2209",
    vtype: "Van",
    origin: "Batticaloa",
    dest: "Colombo",
    driver: "Chamara Dias",
    count: 18,
    wt: 950,
    cap: 2000,
    eta: "08:00",
    status: "COMPLETED",
    gps: false,
    routeFrom: { lat: 7.7172, lng: 81.7006 },
    routeTo: { lat: 6.9271, lng: 79.8612 },
    livePos: { lat: 6.9271, lng: 79.8612 },
  },
];

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_CFG: Record<
  Status,
  { label: string; bg: string; text: string; dot: string; ring: string }
> = {
  ARRIVING: {
    label: "Arriving",
    bg: "#eff6ff",
    text: "#1d4ed8",
    dot: "#3b82f6",
    ring: "border-blue-200",
  },
  ARRIVED: {
    label: "At Hub",
    bg: "#fffbeb",
    text: "#92400e",
    dot: "#f59e0b",
    ring: "border-amber-200",
  },
  UNLOADING: {
    label: "Unloading",
    bg: "#fff7ed",
    text: "#c2410c",
    dot: "#f97316",
    ring: "border-orange-200",
  },
  COMPLETED: {
    label: "Completed",
    bg: "#f0fdf4",
    text: "#166534",
    dot: "#22c55e",
    ring: "border-green-200",
  },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
      style={{ background: cfg.bg, color: cfg.text }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
};

const LoadBar = ({
  wt,
  cap,
  compact = false,
}: {
  wt: number;
  cap: number;
  compact?: boolean;
}) => {
  const pct = Math.round((wt / cap) * 100);
  const high = pct > 88;
  return (
    <div>
      <div
        className={`${compact ? "w-14" : "w-full"} h-1 rounded-full bg-orange-100 overflow-hidden`}
      >
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${pct}%`,
            background: high ? "#ef4444" : "#f97316",
          }}
        />
      </div>
      {!compact && (
        <p className="text-[9px] text-gray-400 mt-0.5">
          {wt.toLocaleString()} kg · {pct}% of {cap.toLocaleString()} kg
        </p>
      )}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: number;
  sub: string;
  accent: string;
}) => (
  <div
    className="bg-white rounded-2xl px-5 py-4 flex flex-col gap-1 border border-gray-100 shadow-sm relative overflow-hidden"
    style={{ borderTop: `3px solid ${accent}` }}
  >
    <span className="text-3xl font-black text-gray-900 leading-none">{value}</span>
    <span className="text-[11px] font-semibold text-gray-500">{label}</span>
    <span className="absolute top-3 right-4 text-[10px] font-bold text-gray-300">{sub}</span>
  </div>
);

// ─── Sidebar Card ─────────────────────────────────────────────────────────────

const SidebarCard = ({
  c,
  active,
  onClick,
}: {
  c: Consignment;
  active: boolean;
  onClick: () => void;
}) => {
  const pct = Math.round((c.wt / c.cap) * 100);
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border p-3.5 cursor-pointer transition-all duration-150 ${
        active
          ? "border-orange-400 bg-orange-50 shadow-md shadow-orange-100"
          : "border-gray-100 bg-white hover:border-orange-300"
      }`}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-black text-orange-500">#{c.id}</span>
        <StatusBadge status={c.status} />
      </div>
      <div className="text-[13px] font-bold text-gray-800 mb-0.5">
        {c.origin} → {c.dest}
      </div>
      <div className="text-[10px] text-gray-400 mb-2">
        {c.vehicle} · {c.driver}
      </div>
      <LoadBar wt={c.wt} cap={c.cap} />
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[9px] text-gray-400">
          {c.wt.toLocaleString()} kg · ETA {c.eta}
        </span>
        {c.gps && (
          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-blue-500">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Live GPS
          </span>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

type FilterTab = "all" | Status;

export default function IncomingConsignmentTracker() {
  const [selectedId, setSelectedId] = useState<string>("CON-1001");
  const [filterTab, setFilterTab] = useState<FilterTab>("all");

  const selected = DATA.find((d) => d.id === selectedId)!;

  const counts = {
    ARRIVING: DATA.filter((d) => d.status === "ARRIVING").length,
    ARRIVED: DATA.filter((d) => d.status === "ARRIVED").length,
    UNLOADING: DATA.filter((d) => d.status === "UNLOADING").length,
    COMPLETED: DATA.filter((d) => d.status === "COMPLETED").length,
  };

  const filtered =
    filterTab === "all"
      ? DATA
      : filterTab === "ARRIVED"
      ? DATA.filter((d) => d.status === "ARRIVED" || d.status === "UNLOADING")
      : DATA.filter((d) => d.status === filterTab);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "ARRIVING", label: "Arriving" },
    { key: "ARRIVED", label: "At Hub" },
    { key: "COMPLETED", label: "Done" },
  ];

  return (
    <div
      className="min-h-screen bg-white p-6"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">
            Hub Operations
          </p>
          <h1 className="text-2xl font-black text-gray-900 leading-tight">
            Incoming Consignments
          </h1>
          <p className="text-[11px] text-gray-400 mt-1">
            Monitor arriving vehicles and verify parcels in real-time
          </p>
        </div>
        <div className="flex gap-2">
          <button className="text-[11px] font-semibold text-gray-600 bg-white border border-gray-200 rounded-xl px-4 py-2 hover:border-orange-300 transition-colors">
            Bulk QR Scan
          </button>
          <button className="text-[11px] font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl px-4 py-2 transition-colors shadow-md shadow-orange-200">
            Export Report
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Arriving" value={counts.ARRIVING} sub="En route" accent="#3b82f6" />
        <StatCard label="Arrived" value={counts.ARRIVED} sub="At gate" accent="#f59e0b" />
        <StatCard label="Unloading" value={counts.UNLOADING} sub="In dock" accent="#f97316" />
        <StatCard label="Completed" value={counts.COMPLETED} sub="Today" accent="#22c55e" />
      </div>

      {/* ── Map + Sidebar ── */}
      <div className="grid gap-4 mb-5" style={{ gridTemplateColumns: "1fr 300px" }}>
        {/* Map Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
            <div className="flex items-center gap-2 text-[12px] font-bold text-gray-800">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Live Vehicle Tracking — Sri Lanka
            </div>
            {selected && (
              <span className="text-[11px] font-bold text-orange-500">
                {selected.origin} → {selected.dest}
              </span>
            )}
          </div>

          {/* CargoMap integration */}
          <CargoMap
            height="420px"
            readOnly={true}
            routeFrom={selected?.routeFrom}
            routeTo={selected?.routeTo}
            hubCoords={selected?.routeTo}
            hubName={selected?.dest ?? "Hub"}
            lat={selected?.livePos?.lat}
            lng={selected?.livePos?.lng}
          />

          {/* Legend */}
          <div className="flex gap-5 px-5 py-2.5 border-t border-gray-50 bg-gray-50/50">
            {[
              {
                icon: (
                  <svg width="18" height="6">
                    <line
                      x1="0" y1="3" x2="18" y2="3"
                      stroke="#f97316" strokeWidth="2.5" strokeDasharray="5,3"
                    />
                  </svg>
                ),
                label: "Route",
              },
              { color: "#3b82f6", label: "Live GPS" },
              { color: "#f97316", label: "Hub" },
              { color: "#22c55e", label: "Completed" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                {"icon" in item ? (
                  item.icon
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: item.color }}
                  />
                )}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[520px] pr-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">
            Consignments
          </p>
          {DATA.map((c) => (
            <SidebarCard
              key={c.id}
              c={c}
              active={c.id === selectedId}
              onClick={() => setSelectedId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-bold text-gray-900">Incoming List</span>
            <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              {filtered.length} records
            </span>
          </div>
          {/* Filter Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setFilterTab(t.key)}
                className={`text-[11px] font-semibold px-3 py-1 rounded-lg transition-all duration-150 ${
                  filterTab === t.key
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[11px] border-collapse">
            <thead>
              <tr className="bg-gray-50/80">
                {[
                  "Consignment ID",
                  "Vehicle",
                  "Route",
                  "Driver",
                  "Shipments",
                  "Load",
                  "ETA",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-wider text-gray-300 border-b border-gray-100 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="text-center py-10 text-[12px] text-gray-300"
                  >
                    No consignments match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const pct = Math.round((c.wt / c.cap) * 100);
                  const isSelected = c.id === selectedId;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedId(c.id)}
                      className={`cursor-pointer border-b border-gray-50 transition-colors duration-100 ${
                        isSelected
                          ? "bg-orange-50"
                          : "hover:bg-gray-50/60"
                      }`}
                    >
                      {/* ID */}
                      <td className="px-4 py-3">
                        <div className="font-black text-orange-500">#{c.id}</div>
                        {c.gps && (
                          <div className="flex items-center gap-1 text-[9px] font-bold text-blue-500 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                            Live GPS
                          </div>
                        )}
                      </td>
                      {/* Vehicle */}
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                          {c.vehicle}
                        </span>
                        <div className="text-[9px] text-gray-300 mt-0.5">{c.vtype}</div>
                      </td>
                      {/* Route */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-gray-500 font-medium">{c.origin}</span>
                        <span className="text-gray-200 mx-1">→</span>
                        <span className="text-orange-500 font-bold">{c.dest}</span>
                      </td>
                      {/* Driver */}
                      <td className="px-4 py-3 font-semibold text-gray-600">{c.driver}</td>
                      {/* Shipments */}
                      <td className="px-4 py-3">
                        <span className="bg-gray-100 text-gray-600 text-[10px] font-semibold px-2 py-0.5 rounded-md">
                          {c.count} items
                        </span>
                      </td>
                      {/* Load */}
                      <td className="px-4 py-3 min-w-[100px]">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-14 h-1 bg-orange-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${pct}%`,
                                background: pct > 90 ? "#ef4444" : "#f97316",
                              }}
                            />
                          </div>
                          <span className="text-[10px] font-semibold text-gray-500">
                            {c.wt.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-300">
                          {pct}% of {c.cap.toLocaleString()} kg
                        </div>
                      </td>
                      {/* ETA */}
                      <td className="px-4 py-3">
                        <div className="font-black text-gray-900 text-[12px]">{c.eta}</div>
                        <div className="text-[9px] text-gray-300">2026-05-09</div>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={c.status} />
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedId(c.id);
                            }}
                            className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-150"
                          >
                            View
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-lg hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-150"
                          >
                            Ack
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}