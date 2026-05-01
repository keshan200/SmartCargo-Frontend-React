import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white">
      
      {/* Container for Animation */}
      <div className="relative flex flex-col items-center">
        
        {/* --- Style 1: Modern Spinning Ring --- */}
        <div className="relative w-20 h-20">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-[#ff6b1a]/10 rounded-full"></div>
          {/* Animated Spinner */}
          <div className="absolute inset-0 border-4 border-t-[#ff6b1a] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          
          {/* Center Icon (Cargo Box) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              width="24" height="24" viewBox="0 0 24 24" fill="none" 
              className="text-[#ff6b1a] animate-pulse"
            >
              <path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 3V21M4 7L12 11L20 7" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* --- Style 2: Bouncing Logistics Dots --- */}
        <div className="flex gap-2 mt-8">
          <div className="w-3 h-3 bg-[#ff6b1a] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-3 h-3 bg-[#ff6b1a] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-3 h-3 bg-[#ff6b1a] rounded-full animate-bounce"></div>
        </div>

        {/* Text Section */}
        <div className="mt-6 text-center">
          <h2 className="font-['Georgia',serif] text-xl font-bold text-[#111] tracking-tight">
            SmartCargo
          </h2>
          <p className="text-[12px] font-medium uppercase tracking-[3px] text-[#ff6b1a] mt-1 overflow-hidden whitespace-nowrap border-r-2 border-[#ff6b1a] animate-typing">
            Optimizing Routes...
          </p>
        </div>
      </div>

      {/* Decorative background element */}
      <div className="absolute bottom-10 text-[10px] text-gray-400 font-medium tracking-widest uppercase">
        Secure Logistics Interface v2.0
      </div>

      {/* Tailwind Custom Animation CSS (Add this to your globals.css) */}
      <style>{`
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        .animate-typing {
          animation: typing 2s steps(20, end) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;