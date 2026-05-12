import { useState } from "react";
import { Icon } from "../components/shipment/Ui";
import { NewShipmentTab, ShipmentsTab } from "../components/shipment/Tabs";

export default function ShipmentPage() {
  const [activeTab, setActiveTab] = useState<"new" | "list">("new");

  return (
    <div className="min-h-screen bg-white font-['Poppins',sans-serif]">
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(14px);  } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* Hero */}
      <div
        className="max-w-screen-xl mx-auto px-6 pt-8 pb-4"
        style={{ animation: "fadeUp 0.5s ease both" }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            
           
            <p className="text-sm text-gray-400 mt-1">
              Create and manage your shipments from one place.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="flex items-center gap-2 px-4 py-1 text-sm  text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:text-orange-500 transition shadow-sm"
            >
              <Icon.Search /> Track Shipment
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("list")}
              className="flex items-center gap-2 px-4 py-1 text-sm  text-gray-600 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:text-orange-500 transition shadow-sm"
            >
              <Icon.History /> History
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[
            {
              label: "Total Shipments",
              value: "1,284",
              icon: "",
              color: "text-gray-700",
              bg: "bg-gray-50",
              border: "border-gray-100",
            },
            {
              label: "Active",
              value: "38",
              icon: "",
              color: "text-orange-600",
              bg: "bg-orange-50",
              border: "border-orange-100",
            },
            {
              label: "Delivered",
              value: "1,246",
              icon: "",
              color: "text-green-600",
              bg: "bg-green-50",
              border: "border-green-100",
            },
          ].map((s) => (
            <div
              key={s.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${s.bg} ${s.border}`}
            >
              <span className="text-sm">{s.icon}</span>
              <div>
                <p className={`text-lg font-bold leading-none ${s.color}`}>
                  {s.value}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
                  {s.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="max-w-screen-xl mx-auto px-6"
        style={{ animation: "fadeUp 0.55s ease both" }}
      >
        <div className="flex items-center gap-1 border-b border-gray-100">
          {(
            [
              { key: "new", label: "New Shipment", icon: "" },
              { key: "list", label: "All Shipments", icon: "" },
            ] as const
          ).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all -mb-px ${
                activeTab === t.key
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <main
        className="max-w-screen-xl mx-auto px-6 pb-8 pt-5"
        style={{ animation: "fadeUp 0.6s ease both" }}
      >
        {activeTab === "new" && <NewShipmentTab />}
        {activeTab === "list" && <ShipmentsTab />}
      </main>
    </div>
  );

  //thi si
}
