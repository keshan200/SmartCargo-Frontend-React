import { useState } from "react";

const shipments = [
  { id: "SC-2024-8821", name: "Nuwan Perera", from: "Negombo", to: "Colombo", weight: "4.2 kg", status: "In Transit" },
  { id: "SC-2024-8820", name: "Sithara Silva", from: "Kandy", to: "Gampaha", weight: "1.8 kg", status: "Delivered" },
  { id: "SC-2024-8819", name: "Kasun Fernando", from: "Colombo", to: "Galle", weight: "6.5 kg", status: "Out for Delivery" },
  { id: "SC-2024-8818", name: "Thilini Jayasuriya", from: "Ratnapura", to: "Colombo", weight: "2.1 kg", status: "Sorting" },
  { id: "SC-2024-8817", name: "Roshan Bandara", from: "Matara", to: "Colombo", weight: "3.7 kg", status: "Picked Up" },
  { id: "SC-2024-8816", name: "Dilani Peris", from: "Jaffna", to: "Colombo", weight: "5.0 kg", status: "In Transit" },
];

const statusConfig: Record<string, { color: string; dot: string; bar: string }> = {
  "Picked Up":        { color: "text-blue-500",   dot: "bg-blue-500",   bar: "bg-blue-500" },
  "In Transit":       { color: "text-orange-500",  dot: "bg-orange-500", bar: "bg-orange-500" },
  "Sorting":          { color: "text-purple-500",  dot: "bg-purple-500", bar: "bg-purple-500" },
  "Out for Delivery": { color: "text-yellow-500",  dot: "bg-yellow-500", bar: "bg-yellow-500" },
  "Delivered":        { color: "text-green-500",   dot: "bg-green-500",  bar: "bg-green-500" },
};

const statusCounts = [
  { label: "Picked Up",        count: 148, icon: "📦", pct: 10 },
  { label: "In Transit",       count: 234, icon: "🚚", pct: 18 },
  { label: "Sorting",          count: 89,  icon: "🏭", pct: 7  },
  { label: "Out for Delivery", count: 187, icon: "🛵", pct: 15 },
  { label: "Delivered",        count: 892, icon: "✅", pct: 70 },
];

export default function SmartCargoDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-lg text-gray-900 font-semibold">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Saturday, 18 April 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search shipments..."
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 pr-8 outline-none focus:border-orange-300 w-48 bg-white text-gray-700 placeholder-gray-400"
            />
            <span className="absolute right-2.5 top-2 text-gray-400 text-xs">🔍</span>
          </div>
          <button className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            + New Shipment
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-500 rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute right-4 top-4 opacity-10 text-7xl">📦</div>
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-4">
            <span className="text-lg">📦</span>
          </div>
          <p className="text-3xl text-white font-semibold">1,284</p>
          <p className="text-xs text-orange-100 mt-0.5">Total Shipments</p>
          <p className="text-xs text-orange-200 mt-3">↑ 12% this month</p>
        </div>

        {[
          { icon: "✅", value: "892", label: "Delivered",       sub: "↑ 8% vs last month" },
          { icon: "🚚", value: "23",  label: "Active Vehicles", sub: "↑ 3 new this week"  },
          { icon: "👥", value: "156", label: "Total Users",     sub: "↑ 15 new users"     },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-4">
              <span className="text-lg">{c.icon}</span>
            </div>
            <p className="text-3xl text-gray-900 font-semibold">{c.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{c.label}</p>
            <p className="text-xs text-green-500 mt-3">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Shipments */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-800 font-medium">Recent Shipments</p>
            <button className="text-xs text-orange-500 hover:underline">View all →</button>
          </div>
          <div className="space-y-2">
            {shipments.map((s) => {
              const cfg = statusConfig[s.status];
              return (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-orange-500 font-medium w-28 shrink-0">{s.id}</span>
                    <div>
                      <p className="text-xs text-gray-800 font-medium">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.from} → {s.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs text-gray-400">{s.weight}</span>
                    <span className={`flex items-center gap-1.5 text-xs ${cfg.color}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                      {s.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-800 font-medium mb-4">Shipment Status</p>
            <div className="space-y-3">
              {statusCounts.map((s) => {
                const cfg = statusConfig[s.label];
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{s.icon}</span>
                        <span className="text-xs text-gray-600">{s.label}</span>
                      </div>
                      <span className="text-xs text-gray-800 font-medium">{s.count}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cfg.bar}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-sm text-gray-800 font-medium mb-3">Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "➕", label: "New Shipment"    },
                { icon: "📍", label: "Track Package"   },
                { icon: "📊", label: "Generate Report" },
                { icon: "🚚", label: "Assign Vehicle"  },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-500 transition-colors text-gray-500"
                >
                  <span className="text-lg">{a.icon}</span>
                  <span className="text-[10px] leading-tight">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}