
import { Icon } from "./Ui";
import CargoMap from "../Map";
import type { Shipment } from "../../types/shipment";
import { STATUS_STYLE, HUB_NAMES } from "./Constants";



// ─── Map Popup Modal ──────────────────────────────────────────────────────────
export const MapModal = ({
  lat, lng, title, onClose,
}: {
  lat: number; lng: number; title: string; onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col" style={{ height: 480 }}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
          <span className="text-orange-500"><Icon.Pin /></span>{title}
        </div>
        <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
          <Icon.X />
        </button>
      </div>
      <div className="flex-1 h-0">
        <CargoMap lat={lat} lng={lng} height="100%" onChange={() => {}} />
      </div>
      <div className="flex gap-4 px-5 py-3 border-t border-gray-100 flex-shrink-0 bg-gray-50">
        <span className="text-xs font-mono text-gray-500">Lat: <strong className="text-orange-600">{lat.toFixed(6)}</strong></span>
        <span className="text-xs font-mono text-gray-500">Lng: <strong className="text-orange-600">{lng.toFixed(6)}</strong></span>
      </div>
    </div>
  </div>
);

// ─── Shipment Detail Modal ────────────────────────────────────────────────────
export const ShipmentDetailModal = ({
  shipment, onClose, onViewMap,
}: {
  shipment: Shipment; onClose: () => void; onViewMap: () => void;
}) => {
  const st = STATUS_STYLE[shipment.status];
  const rows: [string, string][] = [
    ["Tracking ID", shipment.tracking_id],
    ["Sender ID",   shipment.sender_id],
    ["Receiver",    shipment.receiver_name],
    ["Email",       shipment.receiver_email],
    ["Phone",       shipment.receiver_phone],
    ["City",        shipment.receiver_city],
    ["Address",     shipment.receiver_address],
    ["Postal Code", shipment.receiver_postal_code],
    ["Package",     shipment.package_type],
    ["Weight",      `${shipment.weight_kg} kg`],
    ["Dimensions",  shipment.dimensions.length ? `${shipment.dimensions.length}×${shipment.dimensions.width}×${shipment.dimensions.height} cm` : "—"],
    ["Service",     shipment.service_type],
    ["Payment",     shipment.payment_method.replace(/_/g, " ")],
    ["Hub",         HUB_NAMES[shipment.current_hub_id] ?? shipment.current_hub_id],
    ["Total Price", `Rs. ${shipment.total_price.toLocaleString()}`],
    ["Created",     new Date(shipment.created_at).toLocaleString("en-LK")],
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-0.5">Shipment Details</p>
            <p className="text-base font-bold text-gray-900 font-mono">{shipment.tracking_id}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${st.bg} ${st.text}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
            </span>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition">
              <Icon.X />
            </button>
          </div>
        </div>
        {/* Body */}
        <div className="overflow-y-auto flex-1">
          <div className="divide-y divide-gray-50">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-5 py-2.5">
                <span className="text-xs text-gray-400 font-medium w-32 shrink-0">{k}</span>
                <span className="text-xs text-gray-800 font-semibold text-right truncate max-w-[55%]">{v}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-gray-100 flex justify-between items-center flex-shrink-0 bg-gray-50">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-100 transition">
            Close
          </button>
          {shipment.delivery_lat !== null && (
            <button onClick={onViewMap} className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition shadow-sm shadow-orange-200">
              <Icon.MapIcon /> View on Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};