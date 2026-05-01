import { useState, useEffect } from "react";
import type { UserFormData, EmployeeFormData } from "../types/User";
import AccountInfoCard from "../components/users/AccountInfoCard";
import EmployeeDetailsCard from "../components/users/EmployeeDetailsCard";
import SuccessBanner from "../components/users/SuccessBanner";
import SummaryPanel from "../components/users/SummaryPanel";
import TipBox from "../components/users/TipBox";
import { EMPLOYEE_ROLES, MOCK_HUBS } from "../data/mockData";
import type { Hub } from "../types/Hubs"; // ← shipment.ts වෙනුවට Hubs.ts

export default function AddUserPagggge() {
  
  const [userForm, setUserForm] = useState<UserFormData>({
    email: "",
    password: "",
    role: "",
  });

  const [employeeForm, setEmployeeForm] = useState<EmployeeFormData>({
    assigned_hub_id: "",
    license_number: "",
    status: "ACTIVE",
  
  full_name: "",
  mobile_number: "",
  address: "",
  employee_type: "",
  });

  const [hubs, setHubs] = useState<Hub[]>([]);
  const [loadingHubs, setLoadingHubs] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isEmployee =
    userForm.role !== "" && EMPLOYEE_ROLES.includes(userForm.role as any);

  useEffect(() => {
    if (isEmployee) {
      setLoadingHubs(true);
      // TODO: replace with real API call → fetchHubs()
      setTimeout(() => {
        setHubs(MOCK_HUBS);
        setLoadingHubs(false);
      }, 800);
    } else {
      setHubs([]);
     
    }
  }, [isEmployee]);

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmployeeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmployeeForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status: "ACTIVE" | "INACTIVE") => {
    setEmployeeForm((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // TODO: replace with real API call → createUser({ userForm, employeeForm })
    await new Promise((res) => setTimeout(res, 1200));
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleReset = () => {
   
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Add New User</h1>
          <p className="text-sm text-gray-400 mt-1">
            Create a user account. For employee or manager roles, additional details will be required.
          </p>
        </div>

        {submitted && <SuccessBanner />}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <AccountInfoCard userForm={userForm} onChange={handleUserChange} />

              <div
                className={`transition-all duration-500 ease-in-out overflow-hidden ${
                  isEmployee ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <EmployeeDetailsCard
                  employeeForm={employeeForm}
                  onChange={handleEmployeeChange}
                  onStatusChange={handleStatusChange}
                  hubs={hubs}
                  loadingHubs={loadingHubs}
                  role={userForm.role}
                />
              </div>
            </div>

            <div className="space-y-5">
              <SummaryPanel
                userForm={userForm}
                employeeForm={employeeForm}
                hubs={hubs}
                isEmployee={isEmployee}
                isSubmitting={isSubmitting}
                onReset={handleReset}
              />
              <TipBox />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}