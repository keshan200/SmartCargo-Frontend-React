interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export default function Field({ label, required, children }: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-orange-400">*</span>}
      </label>
      {children}
    </div>
  );
}
