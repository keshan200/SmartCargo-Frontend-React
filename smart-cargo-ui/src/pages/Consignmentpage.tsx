
import { useRef, useState } from "react";
import { WeightBar, Toast } from "../components/consigments/Components";
import { DetailPanel } from "../components/consigments/Detailpanel";
import { NewConsignmentModal } from "../components/consigments/Newconsignmentmodal";
import { StatusBadge } from "../components/shipment/Ui";
import { consignments, TABS, stats, formatDateTime } from "../data/mockData";
import type { Consignment } from "../types/consignment";


export default function ConsignmentPage() {
  const [activeTab, setActiveTab]   = useState(0);
  const [modalOpen, setModalOpen]   = useState(false);
  const [detailItem, setDetailItem] = useState<Consignment | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "warning"; visible: boolean }>({
    msg: "", type: "success", visible: false,
  });

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (msg: string, type: "success" | "warning" = "success") => {
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    setToast({ msg, type, visible: true });
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3000,
    );
  };

  const filtered = consignments.filter((c:any) =>
    TABS[activeTab].statuses.includes(c.status),
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap'); *, *::before, *::after { font-family: 'Poppins', sans-serif !important; }`}</style>

      {/* Page Header */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">Consignment Management</h1>
          <p className="text-sm text-gray-400 mt-1">Batch parcels, assign vehicles and manage inter-hub shipments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast("Report exported!", "success")}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-white transition-colors"
          >
            Export
          </button>
          <button
            onClick={() => showToast("QR Scanner activated!", "warning")}
            className="px-3.5 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-white transition-colors"
          >
            Bulk QR Scan
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors"
          >
            + New Consignment
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {stats.map((s:any) => (
          <div key={s.label} className={`bg-white rounded-2xl border border-gray-100 border-t-4 ${s.topColor} p-5 relative`}>
            <div className="text-3xl font-bold text-gray-900 leading-none mb-1">{s.value}</div>
            <div className="text-xs text-gray-400">{s.label}</div>
            <div className={`absolute top-4 right-4 text-xs font-semibold ${s.up ? "text-green-600" : "text-gray-400"}`}>
              {s.delta}
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit mb-4">
        {TABS.map((tab:any, i:any) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === i ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === i ? "bg-orange-500 text-white" : "bg-orange-100 text-orange-500"}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 mb-4 flex-wrap">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Filters</span>
        {[
          { options: ["All Origins", "Negombo Hub", "Colombo Hub", "Kandy Hub", "Galle Hub"] },
          { options: ["All Destinations", "Colombo Hub", "Kandy Hub", "Galle Hub", "Matara Hub"] },
          { options: ["All Vehicle Types", "Truck", "Van", "Bike"] },
        ].map((f, i) => (
          <select key={i} className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none focus:border-orange-400">
            {f.options.map((o) => <option key={o}>{o}</option>)}
          </select>
        ))}
        <span className="text-gray-300 text-sm">to</span>
        <input type="date" className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 outline-none focus:border-orange-400" />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 ml-auto">
          <span className="text-xs text-gray-400 font-medium">Search</span>
          <input type="text" placeholder="Consignment ID..." className="bg-transparent text-sm text-gray-800 outline-none w-40 placeholder-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
            Consignment List
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full font-normal">
              {filtered.length} records
            </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => showToast("Printing...", "success")} className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">P</button>
            <button className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors">S</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Consignment ID", "Vehicle", "Route", "Driver", "Shipments", "Load / Capacity", "Departure", "ETA", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap first:pl-5 last:pr-5 last:text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-16 text-center">
                    <div className="text-sm font-semibold text-gray-500 mb-1">No consignments found</div>
                    <div className="text-xs text-gray-400">Try adjusting your filters or create a new consignment.</div>
                  </td>
                </tr>
              ) : (
                filtered.map((c:any) => {
                  const dep = formatDateTime(c.departure_time);
                  const eta = formatDateTime(c.estimated_arrival);
                  return (
                    <tr key={c.consignment_id} className="hover:bg-gray-50/70 transition-colors">
                      {/* Consignment ID */}
                      <td className="px-4 py-3.5 pl-5">
                        <span className="text-sm font-bold text-orange-500">#{c.consignment_id}</span>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-semibold text-gray-600">
                          {c.vehicle_id}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">{c.vtype}</div>
                      </td>

                      {/* Route — uses origin_label / dest_label */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm text-gray-800 font-medium whitespace-nowrap">
                          {c.origin_label}
                          <span className="text-gray-300 text-xs font-normal">—</span>
                          {c.dest_label}
                        </div>
                      </td>

                      {/* Driver */}
                      <td className="px-4 py-3.5 text-sm font-medium text-gray-800 whitespace-nowrap">{c.driver}</td>

                      {/* Shipments — uses shipment_count */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md text-gray-600 whitespace-nowrap">
                          {c.shipment_count} items
                        </span>
                      </td>

                      {/* Load — uses total_weight_kg / capacity_kg */}
                      <td className="px-4 py-3.5">
                        <WeightBar weight={c.total_weight_kg} capacity={c.capacity_kg} />
                      </td>

                      {/* Departure — parsed from departure_time ISO */}
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-gray-700">{dep.time}</div>
                        <div className="text-[10px] text-gray-400">{dep.date}</div>
                      </td>

                      {/* ETA — parsed from estimated_arrival ISO */}
                      <td className="px-4 py-3.5">
                        <div className="text-sm font-medium text-gray-700">{eta.time}</div>
                        <div className="text-[10px] text-gray-400">{eta.date}</div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <StatusBadge status={c.status} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 pr-5">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDetailItem(c)}
                            className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-600 border border-orange-200 text-xs font-semibold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => showToast("Opening edit form...", "warning")}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => showToast("Manifest downloading...", "success")}
                            className="px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                          >
                            PDF
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

        {/* Pagination */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xs text-gray-400">Showing 1–{filtered.length} of {filtered.length} records</span>
          <div className="flex gap-1">
            {["<", "1", "2", "3", ">"].map((p, i) => (
              <button
                key={i}
                className={`w-7 h-7 rounded-lg border text-xs font-semibold flex items-center justify-center transition-colors ${
                  p === "1"
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overlays */}
      <NewConsignmentModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={showToast} />
      <DetailPanel item={detailItem} onClose={() => setDetailItem(null)} onToast={showToast} />
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </div>
  );
}