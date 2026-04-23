export default function SuccessBanner() {
  return (
    <div className="mb-6 flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
      <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5l2 2 4-4"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="text-sm text-orange-700 font-medium">User created successfully!</p>
    </div>
  );
}
