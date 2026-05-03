import { useEffect, useState } from "react";
import type { Hub, ModalMode } from "../types/Hubs";
import { HubCard } from "../components/Hub/HubCard";
import { HubModal } from "../components/Hub/HubModal";
import { createHub, getAllHubs, updateHub } from "../services/hub.service";
import toast from "react-hot-toast";

const emptyHub: Hub = { _id:"",hub_name: "", city: "", address: "", contact_no: "", latitude: 0, longitude: 0 };

export default function HubPage() {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedHub, setSelectedHub] = useState<Hub>(emptyHub);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Hub, string>>>({});
  const [mapStep, setMapStep] = useState(false);



  const filtered = hubs.filter(
    (h) =>
      h.hub_name.toLowerCase().includes(search.toLowerCase()) ||
      h.city.toLowerCase().includes(search.toLowerCase())
  );



  const validateStep1 = () => {
    const e: Partial<Record<keyof Hub, string>> = {};
    if (!selectedHub.hub_name.trim()) e.hub_name = "Required";
    if (!selectedHub.city.trim()) e.city = "Required";
    if (!selectedHub.address.trim()) e.address = "Required";
    if (!selectedHub.contact_no.trim()) e.contact_no = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };






  const fetchHubs = async () => {
    try {
    
      const data = await getAllHubs();
      setHubs(data);
    } catch (error) {
      console.error("Error fetching hubs:", error);
    } finally {
      
    }
  };

  useEffect(() => {
    fetchHubs();
  }, []);


const handleSave = async () => {
  
  if (!selectedHub.latitude || !selectedHub.longitude) {
    setErrors((e) => ({ ...e, latitude: "Please pin a location on the map" }));
    toast.error("Location not set on map!");
    return;
  }

  try {
    if (modalMode === "add") {

      const newHub = await createHub(selectedHub);

      console.log("Created Hub:", newHub);
      setHubs((prev) => [...prev, newHub]);
      toast.success("Hub created successfully!");

    } else if (modalMode === "edit" && selectedHub._id) {

      const updated = await updateHub(selectedHub._id, selectedHub);
      setHubs((prev) => prev.map((h) => (h._id === updated._id ? updated : h)));
      toast.success("Hub updated successfully!");

    }
    closeModal();

  } catch (error) {

    console.error("Failed to save hub:", error);
    toast.error("Failed to save to database!");

  }
};

  const closeModal = () => { setModalMode(null); setErrors({}); setMapStep(false); };
  const openModal = (mode: ModalMode, hub?: Hub) => {
    setErrors({}); setMapStep(false);
    setSelectedHub(hub ? { ...hub } : emptyHub);
    setModalMode(mode);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Hub Directory</h1>
            <p className="text-sm text-gray-400 mt-1">Manage your distribution network</p>
          </div>
          <button
            onClick={() => openModal("add")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-sm transition-all hover:-translate-y-0.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Add Hub
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Hubs", value: hubs.length, icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" },
            { label: "Cities Active", value: new Set(hubs.map((h) => h.city)).size, icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
            { label: "Added This Quarter", value: hubs.filter((h) => h.createdAt?.startsWith("2024-03")).length, icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl px-6 py-5">
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={s.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 leading-none">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5">
          <span className="text-sm font-semibold text-gray-700">
            All Hubs <span className="text-gray-400 font-normal">({filtered.length})</span>
          </span>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search hubs..."
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-gray-800 placeholder-gray-300 w-56 transition-all"
            />
          </div>
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-gray-200 rounded-2xl bg-white">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <p className="font-semibold text-gray-700">No hubs found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((hub) => (
              <HubCard
                key={hub._id}
                hub={hub}
                onView={(h) => openModal("view", h)}
                onEdit={(h) => openModal("edit", h)}
                onDelete={(id) => setDeleteConfirm(id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <HubModal
        modalMode={modalMode}
        selectedHub={selectedHub}
        setSelectedHub={setSelectedHub}
        closeModal={closeModal}
        mapStep={mapStep}
        setMapStep={setMapStep}
        errors={errors}
        validateStep1={validateStep1}
        handleSave={handleSave}
        openModal={openModal}
      />

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-gray-200 shadow-2xl">
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <p className="font-bold text-gray-900 text-lg">Delete this hub?</p>
              <p className="text-sm text-gray-400 mt-2 mb-7 leading-relaxed">This will permanently remove the hub. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors">Cancel</button>
                <button
                  onClick={() => { setHubs(hubs.filter((h) => h._id !== deleteConfirm)); setDeleteConfirm(null); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
