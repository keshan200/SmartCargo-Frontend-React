import { useState, useEffect } from "react";

import { Icon } from "./Ui";
import { getAllHubs } from "../../services/hub.service";
import type { Hub } from "../../types/Hubs";

// ─── Hub Selector ─────────────────────────────────────────────────────────────
export const HubSelector = ({
  selectedId,
  onSelect,
  onHubsLoaded,         // ← NEW: parent needs hub list for nearest-hub logic
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  onHubsLoaded?: (hubs: Hub[]) => void;
}) => {
  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loading, setLoading] = useState(true);
  const [warn, setWarn] = useState("");

  const fetchHubsData = async () => {
    try {
      setLoading(true);
      const data: any = await getAllHubs();
      const hubsList: Hub[] = Array.isArray(data)
        ? data
        : (data.data ?? data.hubs ?? []);

      setHubs(hubsList);
      onHubsLoaded?.(hubsList);   // ← notify parent

      if (hubsList.length === 0) setWarn("No hubs found in the database.");
    } catch (error) {
      console.error("Error fetching hubs:", error);
      setWarn("Failed to load hubs from the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHubsData(); }, []);

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
                {h.hub_name}
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