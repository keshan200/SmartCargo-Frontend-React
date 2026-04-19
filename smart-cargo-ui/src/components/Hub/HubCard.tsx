import type { Hub } from "../../types/Hubs";

interface HubCardProps {
  hub: Hub;
  onView: (hub: Hub) => void;
  onEdit: (hub: Hub) => void;
  onDelete: (id: string) => void;
}

export const HubCard = ({ hub, onView, onEdit, onDelete }: HubCardProps) => (
  <div className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200">
    <div className="h-0.5 bg-orange-500" />
    <div className="p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0 mr-2">
          <p className="font-semibold text-gray-900 text-sm truncate">{hub.hub_name}</p>
          <span className="inline-flex items-center gap-1 text-orange-500 text-xs font-medium mt-1.5">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {hub.city}
          </span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onView(hub)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          <button
            onClick={() => onEdit(hub)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(hub._id!)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-3" />

      <div className="space-y-2">
        <p className="text-xs text-gray-400 truncate">{hub.address}</p>
        <p className="text-xs text-gray-400 font-mono">{hub.contact_no}</p>
      </div>

      <div className="mt-3 rounded-xl border border-gray-200 px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-orange-500">GPS</span>
        <span className="text-xs text-gray-400 font-mono">
          {hub.latitude.toFixed(4)}, {hub.longitude.toFixed(4)}
        </span>
      </div>

      {hub.createdAt && (
        <p className="text-xs text-gray-300 text-right mt-2">Added {hub.createdAt}</p>
      )}
    </div>
  </div>
);