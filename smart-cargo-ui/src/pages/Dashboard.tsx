// Icon Components
const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
  </svg>
);

const TruckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1" />
    <path d="M16 8h4l3 4.5V16h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const BikeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18.5" cy="17.5" r="3.5" />
    <circle cx="5.5" cy="17.5" r="3.5" />
    <path d="M12 14V4M9 14H3v3h2M15 14h6v3h-2" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const MapPinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10" />
    <line x1="18" y1="20" x2="18" y2="4" />
    <line x1="6" y1="20" x2="6" y2="16" />
  </svg>
);

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
  { label: "Picked Up",        count: 148, icon: PackageIcon, pct: 10 },
  { label: "In Transit",       count: 234, icon: TruckIcon, pct: 18 },
  { label: "Sorting",          count: 89,  icon: BuildingIcon, pct: 7  },
  { label: "Out for Delivery", count: 187, icon: BikeIcon, pct: 15 },
  { label: "Delivered",        count: 892, icon: CheckCircleIcon, pct: 70 },
];

export default function SmartCargoDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6 font-['Poppins',sans-serif]">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-lg text-gray-900 font-semibold">Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Saturday, 18 April 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
            + New Shipment
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-500 rounded-2xl p-5 relative overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-4 text-white">
            <PackageIcon />
          </div>
          <p className="text-3xl text-white font-semibold">1,284</p>
          <p className="text-xs text-orange-100 mt-0.5">Total Shipments</p>
          <p className="text-xs text-orange-200 mt-3">↑ 12% this month</p>
        </div>

        {[
          { icon: CheckCircleIcon, value: "892", label: "Delivered",       sub: "↑ 8% vs last month" },
          { icon: TruckIcon, value: "23",  label: "Active Vehicles", sub: "↑ 3 new this week"  },
          { icon: UsersIcon, value: "156", label: "Total Users",     sub: "↑ 15 new users"     },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 border border-gray-100">
            <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center mb-4 text-gray-600">
              <c.icon />
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
                const IconComponent = s.icon;
                return (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600 w-5 h-5 flex items-center justify-center"><IconComponent /></span>
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
                { icon: PlusIcon, label: "New Shipment"    },
                { icon: MapPinIcon, label: "Track Package"   },
                { icon: BarChartIcon, label: "Generate Report" },
                { icon: TruckIcon, label: "Assign Vehicle"  },
              ].map((a) => (
                <button
                  key={a.label}
                  className="flex flex-col items-center gap-1.5 py-3 rounded-xl bg-gray-50 hover:bg-orange-50 hover:text-orange-500 transition-colors text-gray-500"
                >
                  <span className="w-5 h-5 flex items-center justify-center"><a.icon /></span>
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