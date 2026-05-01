import React from "react";
import type { ShipmentForm } from "../../types/shipment";
import { calcPrice } from "./Utils";
import CargoMap from "../Map";
import { Icon } from "./Ui";
import { PricingConfig } from "./Constants";


// ─── Right Panel (Map + Price) ────────────────────────────────────────────────
export const RightPanel = ({
  form,
  onMapClick,
  onGPS,
  mapKey,
  hubCoords,
  senderCoords,   // ← NEW: geocoded sender location for route start
}: {
  form: ShipmentForm;
  onMapClick: (lat: number, lng: number) => void;
  onGPS: () => void;
  mapKey?: string;
  hubCoords?: { lat: number; lng: number } | null;
  senderCoords?: { lat: number; lng: number } | null;
}) => {
  const pr = calcPrice(form);

  // Route logic:
  // - If delivery pin is set AND hub is selected → route from hub → delivery
  // - If only sender is geocoded (step 1, no delivery pin yet) → route from sender → hub
  // - If both exist → prefer hub → delivery
  const hasDelivery = form.delivery_lat !== null && form.delivery_lng !== null;

  let routeFrom: { lat: number; lng: number } | undefined;
  let routeTo:   { lat: number; lng: number } | undefined;

  if (hubCoords && hasDelivery) {
    // Hub → Delivery (main route)
    routeFrom = hubCoords;
    routeTo   = { lat: form.delivery_lat!, lng: form.delivery_lng! };
  } else if (senderCoords && hubCoords) {
    // Sender → Hub (preview while filling step 1/2)
    routeFrom = senderCoords;
    routeTo   = hubCoords;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 h-0 relative">
        <CargoMap
          key={mapKey}
          lat={form.delivery_lat ?? undefined}
          lng={form.delivery_lng ?? undefined}
          height="100%"
          onChange={(lat, lng) => onMapClick(lat, lng)}
          routeFrom={routeFrom}
          routeTo={routeTo}
        />

        <button
          type="button" onClick={onGPS}
          className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[11px] font-semibold text-orange-500 border border-orange-200 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg hover:bg-orange-50 transition shadow-sm"
        >
          <Icon.Target /> My GPS
        </button>

        {form.delivery_lat !== null && (
          <div className="absolute bottom-3 left-3 right-3 z-10 flex gap-2">
            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200 text-xs font-mono text-orange-700 shadow-sm">
              <span className="text-[9px] font-sans font-bold text-gray-400 uppercase">Lat</span>
              {form.delivery_lat.toFixed(6)}
            </div>
            <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg border border-orange-200 text-xs font-mono text-orange-700 shadow-sm">
              <span className="text-[9px] font-sans font-bold text-gray-400 uppercase">Lng</span>
              {form.delivery_lng!.toFixed(6)}
            </div>
          </div>
        )}
      </div>

      {/* Price Breakdown */}
      <div className="bg-white border-t border-gray-100 p-4 shrink-0">
        <p className="text-[16px] text-orange-500  tracking-widest mb-3 font-sans">Estimated Price</p>
        <div className="space-y-1.5">
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Base fee</span>
            <span className="text-xs font-semibold text-gray-700">Rs. {pr.base}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Weight ({parseFloat(String(form.weight_kg)) || 0} kg × Rs. {PricingConfig.price_per_kg})</span>
            <span className="text-xs font-semibold text-gray-700">Rs. {pr.perKg}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400">Distance ({pr.km} km × Rs. {PricingConfig.price_per_km})</span>
            <span className="text-xs font-semibold text-gray-700">Rs. {pr.perKm}</span>
          </div>
          {pr.multiplierApplied && (
            <div className="flex justify-between">
              <span className="text-xs text-orange-400">Express ×{PricingConfig.express_multiplier}</span>
              <span className="text-xs font-semibold text-orange-400">applied</span>
            </div>
          )}
          <div className="flex justify-between pt-2 mt-1 border-t border-gray-100">
            <span className="text-sm font-bold text-orange-700">Total</span>
            <span className="text-sm font-bold text-orange-500">Rs. {pr.total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Success Screen ───────────────────────────────────────────────────────────
export const Success = ({ id, onReset }: { id: string; onReset: () => void }) => (
  <div className="flex flex-col items-center py-10 text-center">
    <div className="text-orange-500 mb-3 animate-bounce"><Icon.CheckCircle /></div>
    <h2 className="text-xl font-bold text-gray-800 mb-1">Shipment Created!</h2>
    <p className="text-sm text-gray-400 mb-5">Your package has been registered successfully.</p>
    <div className="border border-orange-200 bg-orange-50 rounded-2xl px-8 py-4 mb-6">
      <p className="text-[10px] text-orange-400 uppercase tracking-widest font-bold mb-1">Tracking ID</p>
      <p className="text-lg font-bold text-orange-700 font-mono tracking-widest">{id}</p>
    </div>
    <button onClick={onReset} className="px-7 py-2.5 bg-orange-500 text-white text-sm font-semibold rounded-xl hover:bg-orange-600 transition shadow shadow-orange-200">
      New Shipment
    </button>
  </div>
);