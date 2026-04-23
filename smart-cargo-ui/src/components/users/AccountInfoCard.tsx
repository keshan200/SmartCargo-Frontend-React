import { useState } from "react";

import Field from "./Field";
import { UserRole, type UserFormData } from "../../types/User";

const inputCls =
  "w-full px-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 transition-all";

interface AccountInfoCardProps {
  userForm: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export default function AccountInfoCard({ userForm, onChange }: AccountInfoCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="4.5" r="2.5" stroke="#F97316" strokeWidth="1.3" />
            <path
              d="M1.5 12c0-2.2 2.5-3.5 5.5-3.5s5.5 1.3 5.5 3.5"
              stroke="#F97316"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-sm font-semibold text-gray-800">Account Information</h2>
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="md:col-span-2">
          <Field label="Full Name" required>
            <input
              type="text"
              name="full_name"
              value={userForm.full_name}
              onChange={onChange}
              placeholder="e.g. Kashan Perera"
              required
              className={inputCls}
            />
          </Field>
        </div>

        {/* Email */}
        <Field label="Email Address" required>
          <input
            type="email"
            name="email"
            value={userForm.email}
            onChange={onChange}
            placeholder="user@example.com"
            required
            className={inputCls}
          />
        </Field>

        {/* Phone */}
        <Field label="Phone Number" required>
          <input
            type="tel"
            name="phone_number"
            value={userForm.phone_number}
            onChange={onChange}
            placeholder="+94 76 449 8xx7"
            required
            className={inputCls}
          />
        </Field>

        {/* Password */}
        <Field label="Password" required>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={userForm.password}
              onChange={onChange}
              placeholder="Min. 8 characters"
              required
              minLength={8}
              className={`${inputCls} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-orange-400 transition-colors"
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M2 2l12 12M6.5 6.6A2 2 0 0111 8m-4.5 2.8A2 2 0 015 8c0-.2 0-.4.1-.6"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 9.5C1.5 8.5 1 8 1 8s2.5-5 7-5c1 0 1.9.2 2.7.6M13 9.5c1-.9 2-2 2-1.5 0 0-2.5 5-7 5-1 0-1.9-.2-2.7-.5"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                  />
                  <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.3" />
                </svg>
              )}
            </button>
          </div>
        </Field>

        {/* Role */}
        <Field label="Role" required>
          <select
            name="role"
            value={userForm.role}
            onChange={onChange}
            required
            className={`${inputCls} appearance-none cursor-pointer`}
          >
           
            <option value={UserRole.DISPATCHER}>Dispatcher</option>
            <option value={UserRole.DRIVER}>Driver</option>
            <option value={UserRole.ADMIN}>Admin</option>
          </select>
        </Field>
      </div>
    </section>
  );
}
