export default function TipBox() {
  return (
    <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
      <p className="text-xs text-orange-600 font-medium mb-1">Tip</p>
      <p className="text-xs text-orange-400 leading-relaxed">
        Selecting <strong className="font-semibold text-orange-500">Employee</strong> or{" "}
        <strong className="font-semibold text-orange-500">Manager</strong> will reveal hub assignment and
        license fields below.
      </p>
    </div>
  );
}
