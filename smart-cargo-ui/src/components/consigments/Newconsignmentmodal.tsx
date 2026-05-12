import { availableShipments, inputCls, selectCls } from "../../data/mockData";
import { SectionTitle, FormGroup } from "./Components";
import type { CreateConsignmentDto } from "../../types/consignment";
import { useEffect, useState } from "react";


interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: (msg: string, type: "success" | "warning") => void;
}

// Vehicle options — in real app these come from GET /vehicles
const VEHICLES = [
  { vehicle_id: "WP-6543", label: "WP-6543 — Truck (5,000 kg)", capacity: 5000, vtype: "Truck" },
  { vehicle_id: "CP-8821", label: "CP-8821 — Truck (2,000 kg)", capacity: 2000, vtype: "Truck" },
  { vehicle_id: "NP-3341", label: "NP-3341 — Van (800 kg)",     capacity: 800,  vtype: "Van"   },
  { vehicle_id: "SP-1129", label: "SP-1129 — Van (600 kg)",      capacity: 600,  vtype: "Van"   },
];

// Hub options — in real app these come from GET /hubs
const HUBS = [
  { hub_id: "hub_negombo",  label: "Negombo Sorting Center" },
  { hub_id: "hub_colombo",  label: "Colombo Main Hub"       },
  { hub_id: "hub_kandy",    label: "Kandy Hub"              },
  { hub_id: "hub_galle",    label: "Galle Hub"              },
  { hub_id: "hub_matara",   label: "Matara Hub"             },
];

export function NewConsignmentModal({ open, onClose, onSuccess }: Props) {
  const [selected, setSelected]               = useState<Set<string>>(new Set());
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [originHubId, setOriginHubId]         = useState(HUBS[0].hub_id);
  const [destHubId, setDestHubId]             = useState(HUBS[1].hub_id);
  const [departureTime, setDepartureTime]     = useState("");
  const [estimatedArrival, setEstimatedArrival] = useState("");

  useEffect(() => {
    if (!open) return;

    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    try {
      const user = JSON.parse(storedUser);

      // Support multiple shapes: user.hub.hub_id, user.hub_id, user.hub.id
      const userHubId   = user.hub?.hub_id ?? user.hub?.id ?? user.hub_id ?? "";
      const userHubName = user.hub?.name   ?? user.hub_name ?? "";

      const matchingHub = HUBS.find((h) =>
        h.hub_id === userHubId ||                                                  // 1. exact hub_id match (best)
        h.label === userHubName ||                                                  // 2. exact label match
        h.label.toLowerCase().includes(userHubName.toLowerCase()) ||               // 3. partial label match
        userHubName.toLowerCase().includes(h.hub_id.replace("hub_", ""))           // 4. name inside hub_id key
      );

      if (matchingHub) {
        setOriginHubId(matchingHub.hub_id);
      } else {
        console.warn("No matching hub found for user hub:", userHubId, userHubName);
      }

    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, [open]);


  const toggle = (id: string) =>
    setSelected((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const totalWeight = availableShipments
    .filter((s: any) => selected.has(s.id))
    .reduce((a: any, s: any) => a + s.wt, 0);
  const weightPct = Math.min((totalWeight / selectedVehicle.capacity) * 100, 100);
  const over = totalWeight > selectedVehicle.capacity;

  const handleCreate = () => {
    if (selected.size === 0) {
      onSuccess("Please select at least one parcel", "warning");
      return;
    }
    if (over) {
      onSuccess("Weight exceeds vehicle capacity!", "warning");
      return;
    }

    // Build DTO matching backend CreateConsignmentDto exactly
    const dto: CreateConsignmentDto = {
      consignment_id:     `CON-${Date.now()}`,
      vehicle_id:         selectedVehicle.vehicle_id,
      total_weight_kg:    parseFloat(totalWeight.toFixed(2)),
      origin_hub_id:      originHubId,
      destination_hub_id: destHubId,
      shipment_ids:       Array.from(selected),
      departure_time:     departureTime    ? new Date(departureTime).toISOString()    : new Date().toISOString(),
      estimated_arrival:  estimatedArrival ? new Date(estimatedArrival).toISOString() : new Date().toISOString(),
    };

    // TODO: replace with actual API call:
    // await fetch('/api/consignments', { method: 'POST', body: JSON.stringify(dto) });
    console.log("CreateConsignmentDto →", dto);

    onClose();
    setSelected(new Set());
    onSuccess(`${dto.consignment_id} created successfully!`, "success");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/30 z-[200] flex items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl w-[640px] max-w-[95vw] max-h-[90vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-start justify-between px-6 py-5 border-b border-gray-100 rounded-t-2xl flex-shrink-0">
          <div>
            <div className="text-[15px] font-bold text-gray-900">Create New Consignment</div>
            <div className="text-xs text-gray-400 mt-0.5">Batch parcels and assign vehicle for inter-hub transport</div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-xs font-semibold"
          >
            X
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6 overflow-y-auto flex-1">

          {/* Route — origin_hub_id / destination_hub_id */}
          <section>
            <SectionTitle>Route and Schedule</SectionTitle>
            <div className="grid grid-cols-3 gap-3">
              <FormGroup label="Origin Hub">
                <select
                  className={selectCls}
                  value={originHubId}
                  onChange={(e) => setOriginHubId(e.target.value)}
                >
                  {HUBS.map((h) => (
                    <option key={h.hub_id} value={h.hub_id}>{h.label}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Destination Hub">
                <select
                  className={selectCls}
                  value={destHubId}
                  onChange={(e) => setDestHubId(e.target.value)}
                >
                  {HUBS.map((h) => (
                    <option key={h.hub_id} value={h.hub_id}>{h.label}</option>
                  ))}
                </select>
              </FormGroup>
              {/* departure_time → ISO string sent to backend */}
              <FormGroup label="Departure Time">
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={departureTime}
                  onChange={(e) => setDepartureTime(e.target.value)}
                />
              </FormGroup>
            </div>
          </section>

          {/* Vehicle — vehicle_id */}
          <section>
            <SectionTitle>Vehicle and Driver</SectionTitle>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <FormGroup label="Vehicle (vehicle_id)">
                <select
                  className={selectCls}
                  value={selectedVehicle.vehicle_id}
                  onChange={(e) => {
                    const v = VEHICLES.find((v) => v.vehicle_id === e.target.value)!;
                    setSelectedVehicle(v);
                  }}
                >
                  {VEHICLES.map((v) => (
                    <option key={v.vehicle_id} value={v.vehicle_id}>{v.label}</option>
                  ))}
                </select>
              </FormGroup>
              <FormGroup label="Assign Driver">
                <select className={selectCls}>
                  <option>Nimal Silva — ACTIVE</option>
                  <option>Ruwan Fernando — ACTIVE</option>
                </select>
              </FormGroup>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <FormGroup label="Vehicle Type">
                <input
                  className={`${inputCls} bg-gray-100 text-gray-500 cursor-default`}
                  value={selectedVehicle.vtype}
                  readOnly
                />
              </FormGroup>
              <FormGroup label="Max Capacity">
                <input
                  className={`${inputCls} bg-gray-100 text-gray-500 cursor-default`}
                  value={`${selectedVehicle.capacity.toLocaleString()} kg`}
                  readOnly
                />
              </FormGroup>
              {/* estimated_arrival → ISO string sent to backend */}
              <FormGroup label="Estimated Arrival">
                <input
                  type="datetime-local"
                  className={inputCls}
                  value={estimatedArrival}
                  onChange={(e) => setEstimatedArrival(e.target.value)}
                />
              </FormGroup>
            </div>
          </section>

          {/* Parcels — selected IDs become shipment_ids in DTO */}
          <section>
            <SectionTitle>Add Parcels to Batch</SectionTitle>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 flex justify-between items-center border-b border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  Available Shipments — {HUBS.find((h) => h.hub_id === originHubId)?.label}
                </span>
                <span className="text-xs font-bold text-orange-500">{selected.size} selected</span>
              </div>
              <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                {availableShipments.map((s: any) => {
                  const sel = selected.has(s.id);
                  return (
                    <div
                      key={s.id}
                      onClick={() => toggle(s.id)}
                      className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${sel ? "bg-orange-50" : "hover:bg-gray-50"}`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${sel ? "bg-orange-500 border-orange-500" : "border-gray-300"}`}>
                        {sel && <span className="text-white text-[9px] font-bold leading-none">✓</span>}
                      </div>
                      {/* s.id = tracking ID that goes into shipment_ids[] */}
                      <span className="text-xs font-bold text-orange-500 w-24 flex-shrink-0">{s.id}</span>
                      <span className="text-xs text-gray-500 flex-1">{s.dest}</span>
                      <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">{s.wt} kg</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* total_weight_kg preview */}
            <div className={`flex items-center justify-between mt-3 px-4 py-3 rounded-xl border transition-all duration-300 ${over ? "bg-red-50 border-red-300" : "bg-orange-50 border-orange-200"}`}>
              <div>
                <div className={`text-xs font-semibold mb-2 ${over ? "text-red-700" : "text-orange-700"}`}>
                  total_weight_kg
                </div>
                <div className="w-40 h-1.5 rounded-full bg-orange-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${over ? "bg-red-500" : "bg-orange-500"}`}
                    style={{ width: `${weightPct}%` }}
                  />
                </div>
              </div>
              <div className="text-right">
                <div className={`text-xl font-bold ${over ? "text-red-600" : "text-orange-500"}`}>
                  {totalWeight.toFixed(1)} kg
                </div>
                <div className="text-[11px] text-orange-600 mt-0.5">
                  of {selectedVehicle.capacity.toLocaleString()} kg capacity
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <SectionTitle>Additional Info</SectionTitle>
            <FormGroup label="Dispatcher Notes (Optional)">
              <textarea rows={2} placeholder="Special handling instructions, priority notes..." className={`${inputCls} resize-none`} />
            </FormGroup>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between flex-shrink-0">
          <span className="text-xs text-gray-400">Weight check runs automatically before dispatch.</span>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 font-medium hover:bg-white transition-colors">
              Cancel
            </button>
            <button onClick={handleCreate} className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 transition-colors">
              Create Consignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}