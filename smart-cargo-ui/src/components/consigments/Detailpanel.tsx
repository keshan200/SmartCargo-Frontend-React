import { formatDateTime, selectCls, trackingTimeline } from "../../data/mockData";
import type { Consignment } from "../../types/consignment";
import { StatusBadge } from "./Components";


interface Props {
  item: Consignment | null;
  onClose: () => void;
  onToast: (msg: string, type: "success" | "warning") => void;
}

export function DetailPanel({ item, onClose, onToast }: Props) {
  return (
    <div
      className={`fixed inset-0 z-[200] flex justify-end transition-opacity duration-200 ${
        item ? "opacity-100 pointer-events-auto bg-black/20" : "opacity-0 pointer-events-none"
      }`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`w-[420px] bg-white h-full flex flex-col shadow-2xl transition-transform duration-300 overflow-y-auto ${
          item ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {item && (() => {
          const dep = formatDateTime(item.departure_time);
          const eta = formatDateTime(item.estimated_arrival);
          return (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 z-10 flex-shrink-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xl font-bold text-orange-500">#{item.consignment_id}</span>
                  <button
                    onClick={onClose}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-xs font-semibold"
                  >
                    X
                  </button>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="px-5 py-5 space-y-6 flex-1">

                {/* Route Info — all field names from backend schema */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Route Information</div>
                  {(
                    [
                      ["Origin Hub",      item.origin_label + " Hub"],
                      ["Destination Hub", item.dest_label + " Hub"],
                      ["Origin Hub ID",   item.origin_hub_id],
                      ["Dest Hub ID",     item.destination_hub_id],
                      ["Vehicle ID",      `${item.vehicle_id} (${item.vtype})`],
                      ["Driver",          item.driver],
                      ["Departure Time",  `${dep.date} ${dep.time}`],
                      ["Estimated Arrival", `${eta.date} ${eta.time}`],
                      ["Total Weight",    `${item.total_weight_kg} kg / ${item.capacity_kg.toLocaleString()} kg`],
                      ["Shipments",       `${item.shipment_count} items (${item.shipment_ids.length} IDs)`],
                    ] as [string, string][]
                  ).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-0 text-sm">
                      <span className="text-gray-400 flex-shrink-0 mr-4">{k}</span>
                      <span className="text-gray-800 font-medium text-right">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Update Status — uses backend enum values */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Update Status</div>
                  <div className="flex gap-2">
                    <select className={`flex-1 ${selectCls}`} defaultValue={item.status}>
                      {(["CREATED", "DISPATCHED", "ARRIVED", "COMPLETED"] as const).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => onToast("Status updated!", "success")}
                      className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors whitespace-nowrap"
                    >
                      Update
                    </button>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Tracking History</div>
                  <div className="pl-1">
                    {trackingTimeline.map((t:any, i:any) => (
                      <div key={i} className="flex gap-3.5 pb-4 last:pb-0">
                        <div className="flex flex-col items-center flex-shrink-0 w-4">
                          <div className="w-3 h-3 rounded-full border-2 border-orange-500 bg-orange-500 flex-shrink-0" />
                          {i < trackingTimeline.length - 1 && (
                            <div className="flex-1 w-px bg-orange-200 mt-1" />
                          )}
                        </div>
                        <div className="pb-1">
                          <div className="text-sm font-medium text-gray-800">{t.status}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{t.loc}</div>
                          <div className="text-[11px] text-orange-500 mt-0.5">{t.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipment IDs — from backend shipment_ids array */}
                <div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Shipment IDs in Consignment{" "}
                    <span className="text-orange-500 normal-case font-semibold">({item.shipment_ids.length} IDs)</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {item.parcels.map((p :any) => (
                      <div key={p.id} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                        <div>
                          {/* p.id maps to an entry in shipment_ids */}
                          <div className="text-xs font-bold text-orange-500">{p.id}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{p.city}</div>
                        </div>
                        <span className="text-xs font-semibold text-gray-600">{p.wt} kg</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Manifest Download */}
                <div className="flex items-center gap-3 p-3.5 bg-orange-50 border border-orange-200 rounded-xl">
                  <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold tracking-wide">PDF</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">Consignment Note / Manifest</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">Contains all shipment IDs, weights and route info</div>
                  </div>
                  <button
                    onClick={() => onToast("Manifest PDF downloading...", "success")}
                    className="px-3 py-1.5 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                  >
                    Download
                  </button>
                </div>
              </div>
            </>
          );
        })()}
      </div>
    </div>
  );
}