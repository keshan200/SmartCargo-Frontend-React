

import type { Hub } from "../../types/Hubs";
import type { EmployeeFormData } from "../../types/User";
import Field from "./Field";

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all";

interface EmployeeDetailsCardProps {
  employeeForm: EmployeeFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onStatusChange: (status: "ACTIVE" | "INACTIVE") => void;
  hubs: Hub[];
  loadingHubs: boolean;
  role: string;
}

export default function EmployeeDetailsCard({
  employeeForm,
  onChange,
  onStatusChange,
  hubs,
  loadingHubs,
  role,
}: EmployeeDetailsCardProps) {
  return (
    <section className="bg-white border border-orange-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-orange-100 bg-orange-50 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1.5" y="3" width="11" height="8.5" rx="1.5" stroke="#F97316" strokeWidth="1.3" />
            <path
              d="M5 3V2a1 1 0 012 0v1M7 3V2a1 1 0 012 0v1"
              stroke="#F97316"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            <path d="M4 7h6M4 9h4" stroke="#F97316" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-orange-700">Employee Details</h2>
          <p className="text-xs text-orange-400">Required for employee &amp; manager roles</p>
        </div>
        <span className="ml-auto px-2.5 py-1 text-xs font-medium bg-orange-100 text-orange-600 rounded-lg">
          {role}
        </span>
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hub */}
        <div className="md:col-span-2">
          <Field label="Assigned Hub" required>
            {loadingHubs ? (
              <div className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-sm text-gray-400">Loading hubs...</span>
              </div>
            ) : (
              <select
                name="assigned_hub_id"
                value={employeeForm.assigned_hub_id}
                onChange={onChange}
                required
                className={`${inputCls} appearance-none cursor-pointer`}
              >
                <option value="">Select a hub</option>
                {hubs.map((hub) => (
                  <option key={hub._id} value={hub._id}>
                    {hub.hub_name} — {hub.city}
                  </option>
                ))}
              </select>
            )}
            {employeeForm.assigned_hub_id && (
              <p className="mt-1.5 text-xs text-gray-400 font-mono">ID: {employeeForm.assigned_hub_id}</p>
            )}
          </Field>
        </div>

        {/* License */}
        <Field label="License Number" required>
          <input
            type="text"
            name="license_number"
            value={employeeForm.license_number}
            onChange={onChange}
            placeholder="e.g. WP-B-1234567"
            required
            className={`${inputCls} font-mono`}
          />
        </Field>

        {/* Status toggle */}
        <Field label="Status">
          <div className="flex gap-3 mt-1">
            {(["ACTIVE", "INACTIVE"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onStatusChange(s)}
                className={`flex-1 py-2.5 text-sm rounded-xl border font-medium transition-all ${
                  employeeForm.status === s
                    ? s === "ACTIVE"
                      ? "bg-orange-500 border-orange-500 text-white"
                      : "bg-gray-100 border-gray-200 text-gray-600"
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                }`}
              >
                {s === "ACTIVE" ? "✓ Active" : "○ Inactive"}
              </button>
            ))}
          </div>
        </Field>
      </div>
    </section>
  );
}
