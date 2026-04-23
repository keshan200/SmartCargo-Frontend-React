
import { useState, useCallback } from "react";
import type { ShipmentForm, Shipment } from "../../types/shipment";
import { MOCK_SHIPMENTS, inp } from "./Constants";
import { StepBar, Step1, Step2, Step3, Step4 } from "./Formsteps ";
import { ShipmentDetailModal, MapModal } from "./Modals";
import { Success, RightPanel } from "./Rightpanel";
import { Icon, Label, StatusBadge } from "./Ui";


// ─── New Shipment Tab ─────────────────────────────────────────────────────────
export const NewShipmentTab = () => {
  const [step, setStep]             = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [errors, setErrors]         = useState<string[]>([]);

  const [form, setForm] = useState<ShipmentForm>({
    sender_id: "69de53b1d7389b388eb26a10",
    receiver_name: "", receiver_email: "", receiver_phone: "",
    receiver_address: "", receiver_city: "", receiver_postal_code: "",
    package_type: "PARCEL", weight_kg: "",
    dimensions: { length: 0, width: 0, height: 0 },
    service_type: "STANDARD", payment_method: "CASH_ON_DELIVERY",
    current_hub_id: "", delivery_lat: null, delivery_lng: null,
  });

  const set = useCallback((key: keyof ShipmentForm, val: any) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors([]);
  }, []);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    setForm(p => ({ ...p, delivery_lat: parseFloat(lat.toFixed(6)), delivery_lng: parseFloat(lng.toFixed(6)) }));
    setErrors([]);
  }, []);

  const handleGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(pos => {
      setForm(p => ({
        ...p,
        delivery_lat: parseFloat(pos.coords.latitude.toFixed(6)),
        delivery_lng: parseFloat(pos.coords.longitude.toFixed(6)),
      }));
    });
  }, []);

  const validate = () => {
    const e: string[] = [];
    if (step === 1) {
      if (!form.receiver_name.trim())         e.push("Full name required");
      if (!form.receiver_email.trim())        e.push("Email required");
      if (!form.receiver_phone.trim())        e.push("Phone required");
      if (!form.receiver_address.trim())      e.push("Address required");
      if (!form.receiver_city.trim())         e.push("City required");
      if (!form.receiver_postal_code.trim())  e.push("Postal code required");
    }
    if (step === 2) {
      if (form.weight_kg === "" || Number(form.weight_kg) <= 0) e.push("Valid weight required");
    }
    if (step === 3) {
      if (!form.current_hub_id)      e.push("Select a hub");
      if (form.delivery_lat === null) e.push("Pin delivery location on map");
    }
    setErrors(e);
    return e.length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      // const res = await fetch("/api/shipments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      // const data = await res.json(); setTrackingId(data.tracking_id);
      await new Promise(r => setTimeout(r, 1200));
      setTrackingId(`SC-${Date.now().toString(36).toUpperCase()}`);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="grid grid-cols-2 gap-0 border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
      style={{ height: "calc(100vh - 370px)", minHeight: 560 }}
    >
      {/* LEFT */}
      <div className="bg-white p-6 border-r border-gray-100 flex flex-col h-full">
        {submitted ? (
          <Success id={trackingId} onReset={() => { setSubmitted(false); setStep(1); }} />
        ) : (
          <>
            <StepBar current={step} />
            {errors.length > 0 && (
              <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                {errors.map(e => <p key={e} className="text-xs text-red-500 font-medium">• {e}</p>)}
              </div>
            )}
            <div className="flex-1 overflow-y-auto">
              {step === 1 && <Step1 f={form} set={set} />}
              {step === 2 && <Step2 f={form} set={set} />}
              {step === 3 && <Step3 f={form} set={set} />}
              {step === 4 && <Step4 f={form} set={set} />}
            </div>
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setStep(s => Math.max(s - 1, 1))}
                className={`px-5 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition ${step === 1 ? "invisible" : ""}`}
              >
                ← Back
              </button>
              <button
                onClick={() => step < 4 ? (validate() && setStep(step + 1)) : submit()}
                disabled={submitting}
                className="px-6 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg shadow-sm shadow-orange-200 flex items-center gap-2 hover:bg-orange-600 transition disabled:opacity-60"
              >
                {submitting ? <Icon.Spin /> : step === 4 ? "Submit Shipment" : "Continue →"}
              </button>
            </div>
          </>
        )}
      </div>
      {/* RIGHT: Map */}
      <div className="bg-gray-50 flex flex-col h-full">
        <RightPanel
          form={form}
          onMapClick={handleMapClick}
          onGPS={handleGPS}
          mapKey={`${form.delivery_lat},${form.delivery_lng}`}
        />
      </div>
    </div>
  );
};

// ─── Shipments List Tab ───────────────────────────────────────────────────────
export const ShipmentsTab = () => {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filterDate,   setFilterDate]   = useState("");
  const [filterCity,   setFilterCity]   = useState("");
  const [filterSender, setFilterSender] = useState("");
  const [filterPhone,  setFilterPhone]  = useState("");
  const [selected,     setSelected]     = useState<Shipment | null>(null);
  const [mapShipment,  setMapShipment]  = useState<Shipment | null>(null);

  useState(() => {
    (async () => {
      try {
        const res = await fetch("/api/shipments");
        if (!res.ok) throw new Error();
        const d = await res.json();
        setShipments(Array.isArray(d) ? d : (d.data ?? d.shipments ?? []));
      } catch {
        setShipments(MOCK_SHIPMENTS);
      } finally {
        setLoading(false);
      }
    })();
  });

  const filtered = shipments.filter(s => {
    if (filterDate) {
      const created = new Date(s.created_at).toISOString().slice(0, 10);
      if (created !== filterDate) return false;
    }
    if (filterCity   && !s.receiver_city.toLowerCase().includes(filterCity.toLowerCase()))   return false;
    if (filterSender && !s.sender_id.toLowerCase().includes(filterSender.toLowerCase()))     return false;
    if (filterPhone  && !s.receiver_phone.includes(filterPhone))                             return false;
    return true;
  });

  const hasFilters = filterDate || filterCity || filterSender || filterPhone;
  const clearFilters = () => { setFilterDate(""); setFilterCity(""); setFilterSender(""); setFilterPhone(""); };

  return (
    <>
      {selected && !mapShipment && (
        <ShipmentDetailModal shipment={selected} onClose={() => setSelected(null)} onViewMap={() => setMapShipment(selected)} />
      )}
      {mapShipment && mapShipment.delivery_lat !== null && (
        <MapModal lat={mapShipment.delivery_lat!} lng={mapShipment.delivery_lng!} title={`${mapShipment.tracking_id} — ${mapShipment.receiver_city}`} onClose={() => setMapShipment(null)} />
      )}

      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-orange-500"><Icon.Filter /></span>
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filters</p>
            {hasFilters && (
              <button onClick={clearFilters} className="ml-auto text-[11px] text-red-400 hover:text-red-500 font-semibold transition">Clear all</button>
            )}
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div><Label t="Date" /><input type="date" className={inp} value={filterDate} onChange={e => setFilterDate(e.target.value)} /></div>
            <div>
              <Label t="City" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="Colombo" value={filterCity} onChange={e => setFilterCity(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Search /></span>
              </div>
            </div>
            <div>
              <Label t="Sender ID" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="69de53b1..." value={filterSender} onChange={e => setFilterSender(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.User /></span>
              </div>
            </div>
            <div>
              <Label t="Receiver Phone" />
              <div className="relative">
                <input className={inp + " pl-8"} placeholder="077..." value={filterPhone} onChange={e => setFilterPhone(e.target.value)} />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"><Icon.Phone /></span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 font-medium px-1">
          {loading ? "Loading…" : `${filtered.length} shipment${filtered.length !== 1 ? "s" : ""}${hasFilters ? " matched" : ""}`}
        </p>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 gap-2 text-sm">
            <Icon.Spin cls="w-5 h-5" /> Loading shipments…
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-medium">No shipments found</p>
            {hasFilters && <p className="text-xs mt-1">Try clearing the filters</p>}
          </div>
        ) : (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="grid gap-0 bg-gray-50 border-b border-gray-100 px-4 py-2.5"
              style={{ gridTemplateColumns: "1.4fr 1.2fr 0.9fr 1.1fr 0.9fr 0.9fr auto" }}>
              {["Tracking ID", "Receiver", "City", "Sender ID", "Phone", "Status", "Actions"].map(h => (
                <p key={h} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</p>
              ))}
            </div>
            <div className="divide-y divide-gray-50">
              {filtered.map(s => (
                <div key={s._id}
                  className="grid gap-0 px-4 py-3 items-center hover:bg-orange-50/30 transition"
                  style={{ gridTemplateColumns: "1.4fr 1.2fr 0.9fr 1.1fr 0.9fr 0.9fr auto" }}>
                  <div>
                    <p className="text-xs font-bold text-orange-600 font-mono">{s.tracking_id}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(s.created_at).toLocaleDateString("en-LK")}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800 truncate">{s.receiver_name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{s.receiver_email}</p>
                  </div>
                  <p className="text-xs text-gray-600 font-medium">{s.receiver_city}</p>
                  <p className="text-[11px] text-gray-500 font-mono truncate" title={s.sender_id}>…{s.sender_id.slice(-8)}</p>
                  <p className="text-xs text-gray-600">{s.receiver_phone}</p>
                  <StatusBadge status={s.status} />
                  <div className="flex items-center gap-1.5 pl-2">
                    <button onClick={() => setSelected(s)}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-orange-300 hover:text-orange-500 transition">
                      <Icon.Eye /> View
                    </button>
                    {s.delivery_lat !== null && (
                      <button onClick={() => setMapShipment(s)}
                        className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-gray-500 border border-gray-200 rounded-lg hover:border-blue-300 hover:text-blue-500 transition">
                        <Icon.MapIcon /> Map
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};