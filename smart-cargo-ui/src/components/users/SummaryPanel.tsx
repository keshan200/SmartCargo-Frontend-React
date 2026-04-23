import type { Hub } from "../../types/Hubs";
import type { UserFormData, EmployeeFormData } from "../../types/User";


interface SummaryPanelProps {
  userForm: UserFormData;
  employeeForm: EmployeeFormData;
  hubs: Hub[];
  isEmployee: boolean;
  isSubmitting: boolean;
  onReset: () => void;
}

export default function SummaryPanel({
  userForm,
  employeeForm,
  hubs,
  isEmployee,
  isSubmitting,
  onReset,
}: SummaryPanelProps) {
  const summaryRows: { label: string; value: string; highlight?: boolean }[] = [
    { label: "Name", value: userForm.full_name || "—" },
    { label: "Email", value: userForm.email || "—" },
    { label: "Phone", value: userForm.phone_number || "—" },
    { label: "Role", value: userForm.role || "—", highlight: !!userForm.role },
  ];

  const employeeRows: { label: string; value: string }[] = [
    {
      label: "Hub",
      value: hubs.find((h) => h._id === employeeForm.assigned_hub_id)?.hub_name ?? "—",
    },
    { label: "License", value: employeeForm.license_number || "—" },
    { label: "Status", value: employeeForm.status },
  ];

  return (
    <section className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-24">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Summary</h3>

      <div className="space-y-3">
        {summaryRows.map((item) => (
          <div key={item.label} className="flex items-start justify-between gap-3">
            <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{item.label}</span>
            <span
              className={`text-xs text-right break-all ${
                item.highlight
                  ? "text-orange-500 font-semibold"
                  : item.value === "—"
                  ? "text-gray-200"
                  : "text-gray-700 font-medium"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {isEmployee && (
        <>
          <div className="my-4 border-t border-dashed border-orange-100" />
          <p className="text-xs text-orange-400 font-medium mb-3 uppercase tracking-wider">Employee Info</p>
          <div className="space-y-3">
            {employeeRows.map((item) => (
              <div key={item.label} className="flex items-start justify-between gap-3">
                <span className="text-xs text-gray-400 flex-shrink-0">{item.label}</span>
                <span
                  className={`text-xs text-right font-medium ${
                    item.value === "—" ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="mt-6 space-y-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v12M1 7h12" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Create User
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 text-sm rounded-xl border border-gray-200 transition-all"
        >
          Reset
        </button>
      </div>
    </section>
  );
}
