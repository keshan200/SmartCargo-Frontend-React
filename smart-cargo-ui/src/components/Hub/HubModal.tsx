import type { Hub, ModalMode } from "../../types/Hubs";
import CargoMap from "../Map";

const inputCls = (hasError?: boolean) =>
  `w-full px-3.5 py-2.5 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-gray-900 placeholder-gray-300 ${
    hasError ? "border-red-300 bg-red-50" : "border-gray-200"
  }`;

interface HubModalProps {
  modalMode: ModalMode;
  selectedHub: Hub;
  setSelectedHub: React.Dispatch<React.SetStateAction<Hub>>;
  closeModal: () => void;
  mapStep: boolean;
  setMapStep: (step: boolean) => void;
  errors: Partial<Record<keyof Hub, string>>;
  validateStep1: () => boolean;
  handleSave: () => void;
  openModal: (mode: ModalMode, hub?: Hub) => void;
}

export const HubModal = ({
  modalMode, selectedHub, setSelectedHub,
  closeModal, mapStep, setMapStep,
  errors, validateStep1, handleSave, openModal,
}: HubModalProps) => {
  if (!modalMode) return null;

  const isWide = mapStep || modalMode === "view";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className={`bg-white rounded-2xl w-full border border-gray-200 shadow-2xl overflow-hidden transition-all ${isWide ? "max-w-4xl" : "max-w-lg"}`}>

        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {modalMode === "add" ? "New Hub" : modalMode === "edit" ? "Edit Hub" : "Hub Details"}
              </p>
              {modalMode !== "view" && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {mapStep ? "Step 2 — Pin location on map" : "Step 1 — Hub information"}
                </p>
              )}
            </div>
          </div>
          <button onClick={closeModal} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* VIEW */}
        {modalMode === "view" && (
          <>
            <div className="flex min-h-[460px]">
              <div className="w-64 shrink-0 p-6 border-r border-gray-100 bg-gray-50 flex flex-col gap-5">
                <div>
                  <span className="text-xs font-medium text-orange-500">{selectedHub.city}</span>
                  <h3 className="mt-1.5 text-lg font-bold text-gray-900 leading-snug">{selectedHub.hub_name}</h3>
                </div>
                {[
                  { label: "Address", val: selectedHub.address },
                  { label: "Contact", val: selectedHub.contact_no },
                ].map((r) => (
                  <div key={r.label}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">{r.label}</p>
                    <p className="text-sm text-gray-700">{r.val}</p>
                  </div>
                ))}
                <div className="border border-gray-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider mb-2">GPS</p>
                  <p className="text-sm text-gray-900 font-mono">{selectedHub.latitude.toFixed(6)}</p>
                  <p className="text-sm text-gray-900 font-mono mt-1">{selectedHub.longitude.toFixed(6)}</p>
                </div>
              </div>
              <div className="flex-1 p-4">
                <CargoMap lat={selectedHub.latitude} lng={selectedHub.longitude} readOnly height="100%" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Close</button>
              <button onClick={() => openModal("edit", selectedHub)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors">Edit Hub</button>
            </div>
          </>
        )}

        {/* ADD/EDIT Step 1 */}
        {(modalMode === "add" || modalMode === "edit") && !mapStep && (
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Hub Name *</label>
                <input value={selectedHub.hub_name} onChange={(e) => setSelectedHub((h) => ({ ...h, hub_name: e.target.value }))} placeholder="e.g. Colombo Central Hub" className={inputCls(!!errors.hub_name)} />
                {errors.hub_name && <p className="text-red-400 text-xs mt-1">{errors.hub_name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">City *</label>
                <input value={selectedHub.city} onChange={(e) => setSelectedHub((h) => ({ ...h, city: e.target.value }))} placeholder="e.g. Colombo" className={inputCls(!!errors.city)} />
                {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact No *</label>
                <input value={selectedHub.contact_no} onChange={(e) => setSelectedHub((h) => ({ ...h, contact_no: e.target.value }))} placeholder="+94 11 234 5678" className={inputCls(!!errors.contact_no) + " font-mono"} />
                {errors.contact_no && <p className="text-red-400 text-xs mt-1">{errors.contact_no}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address *</label>
                <textarea value={selectedHub.address} onChange={(e) => setSelectedHub((h) => ({ ...h, address: e.target.value }))} placeholder="Full delivery address..." rows={2} className={inputCls(!!errors.address) + " resize-none"} />
                {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={closeModal} className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => validateStep1() && setMapStep(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-all hover:-translate-y-0.5">
                Next — Pin Location
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          </div>
        )}

        {/* ADD/EDIT Step 2 */}
        {(modalMode === "add" || modalMode === "edit") && mapStep && (
          <div className="flex min-h-[460px]">
            <div className="w-56 shrink-0 p-5 border-r border-gray-100 bg-gray-50 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-3.5">
                  <p className="text-sm font-semibold text-gray-700">Click on the map to pin</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">Or enter coordinates manually below.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Latitude</label>
                  <input type="number" step="0.0001" value={selectedHub.latitude || ""} onChange={(e) => setSelectedHub((h) => ({ ...h, latitude: parseFloat(e.target.value) || 0 }))} placeholder="6.9271" className={inputCls() + " font-mono"} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Longitude</label>
                  <input type="number" step="0.0001" value={selectedHub.longitude || ""} onChange={(e) => setSelectedHub((h) => ({ ...h, longitude: parseFloat(e.target.value) || 0 }))} placeholder="79.8612" className={inputCls() + " font-mono"} />
                </div>
                {errors.latitude && <p className="text-red-400 text-xs">{errors.latitude}</p>}
              </div>
              <div className="space-y-2">
                <button onClick={handleSave} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors">
                  {modalMode === "add" ? "Create Hub" : "Save Changes"}
                </button>
                <button onClick={() => setMapStep(false)} className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-white transition-colors">← Back</button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <CargoMap lat={selectedHub.latitude} lng={selectedHub.longitude} height="100%"
                onChange={(lat: number, lng: number) => setSelectedHub((h) => ({ ...h, latitude: lat, longitude: lng }))} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};