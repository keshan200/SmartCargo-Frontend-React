import { useState, useEffect } from "react";

import type { Hub } from "../../types/shipment";
import { Icon } from "./Ui";

// ─── Hub Selector ─────────────────────────────────────────────────────────────
export const HubSelector = ({
  selectedId, onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) => {
  const [hubs, setHubs]       = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn]       = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/hubs");
        if (!res.ok) throw new Error();
        const d = await res.json();
        setHubs(Array.isArray(d) ? d : (d.data ?? d.hubs ?? []));
      } catch {
        setHubs([
          { _id: "69de3845f456dec19be397dd", name: "Colombo Central Hub", city: "Colombo" },
          { _id: "69de3845f456dec19be397de", name: "Kandy Regional Hub",  city: "Kandy" },
          { _id: "69de3845f456dec19be397df", name: "Galle Southern Hub",  city: "Galle" },
          { _id: "69de3845f456dec19be397e0", name: "Jaffna Northern Hub", city: "Jaffna" },
          { _id: "69de3845f456dec19be397e1", name: "Kurunegala Hub",      city: "Kurunegala" },
        ]);
        setWarn("Mock data — connect /api/hubs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="flex items-center gap-2 py-3 text-sm text-gray-400">
        <Icon.Spin /> Loading hubs…
      </div>
    );

  return (
    <div>
      {warn && <p className="text-[11px] text-amber-500 mb-2">⚠ {warn}</p>}
      <div className="grid grid-cols-1 gap-1.5 max-h-52 overflow-y-auto">
        {hubs.map(h => (
          <button
            key={h._id}
            type="button"
            onClick={() => onSelect(h._id)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-left transition-all ${
              selectedId === h._id
                ? "border-orange-400 bg-orange-50"
                : "border-gray-200 bg-white hover:border-orange-200"
            }`}
          >
            <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
              selectedId === h._id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"
            }`}>
              <Icon.Building />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${selectedId === h._id ? "text-orange-700" : "text-gray-700"}`}>
                {h.name}
              </p>
              <p className={`text-[11px] ${selectedId === h._id ? "text-orange-400" : "text-gray-400"}`}>
                {h.city}
              </p>
            </div>
            {selectedId === h._id && (
              <div className="text-orange-500 flex-shrink-0"><Icon.Check /></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};