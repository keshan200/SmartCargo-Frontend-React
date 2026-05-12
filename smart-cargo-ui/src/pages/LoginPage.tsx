import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../services/user.service";
import { useAuth } from "../context/useAuth";
import axios from "axios";
import LoadingScreen from "../components/Loading";

type Field = "email" | "password";

const SmartCargoLogin = () => {
  const [email, setEmail]           = useState("");
  const [password, setPassword]     = useState("");
  const [showPassword, setShowPass] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);
  const [mounted, setMounted]       = useState(false);
  const [focusedField, setFocused]  = useState<Field | null>(null);
  const [remember, setRemember]     = useState(false);

  const navigate = useNavigate();
  const { login: authenticate } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) return <LoadingScreen />;

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);
      const formData = { email, password };
    try {

       const response = await login(formData);

       console.log("Login response: ", response);

       if (response.user) {
         localStorage.setItem("user", JSON.stringify(response.user));
       }
     
        setIsLoading(true)
        authenticate(response.accessToken)
        
        navigate("/dashboard")

    } catch (error: any) {

      if (axios.isAxiosError(error)) {
        toast.error(error.message);
      } else {
        toast.error("something went wrong");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls = (field: Field) =>
    `w-full h-[44px] pl-10 text-[13px] outline-none rounded-xl border box-border transition-all duration-200
    ${focusedField === field
      ? "border-[#ff6b1a] shadow-[0_0_0_4px_rgba(255,107,26,0.08)] bg-white"
      : "border-[#e8e8e8] bg-[#fafafa]"}`;

  const iconColor = (field: Field) =>
    focusedField === field ? "text-[#ff6b1a]" : "text-[#bbb]";

  const stats = [
    { num: "98.4%", label: "On-time Delivery" },
    { num: "2.4M",  label: "Shipments Tracked" },
    { num: "150+",  label: "Active Routes" },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white font-['Poppins',sans-serif]">

      {/* LEFT PANEL */}
      <div
        className={`relative flex-[1.1] flex flex-col justify-between p-12 overflow-hidden
          transition-all duration-700 ease-out
          ${mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-7"}`}
        style={{ background: "linear-gradient(145deg,#ff6b1a 0%,#ff4500 55%,#e63900 100%)" }}
      >
        <div className="absolute w-[520px] h-[520px] bg-white/[.06] rounded-full -top-[120px] -right-[160px]" />
        <div className="absolute w-[300px] h-[300px] bg-white/[.05] rounded-full bottom-10 -left-20" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/35 backdrop-blur-sm flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L12 3L4 7V17L12 21L20 17V7Z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M12 3V21M4 7L12 11L20 7" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="font-['Georgia','Times_New_Roman',serif] text-xl font-bold text-white tracking-tight">SmartCargo</div>
            <div className="text-[11px] font-medium uppercase tracking-[1.5px] text-white/65 mt-0.5">Management System</div>
          </div>
        </div>

        <div className="absolute z-0 grid grid-cols-4 gap-2 bottom-[130px] right-[52px] opacity-15">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-8 h-8 bg-white rounded-md"
              style={{ opacity: i % 3 === 2 ? .3 : i % 2 === 0 ? .6 : 1 }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-sm px-4 py-1.5 mb-7">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-xs font-medium text-white/90 tracking-[0.4px]">Real-time Tracking Active</span>
          </div>
          <h1 className="font-['Georgia','Times_New_Roman',serif] text-[54px] text-white leading-[1.1] tracking-tight mb-5 mt-0">
            Logistics,<br/>Reimagined<br/>for 2025.
          </h1>
          <p className="text-[17px] leading-[1.7] font-light text-white/72 max-w-[340px] m-0">
            One platform to track, manage, and optimize your entire cargo operations — from first mile to last delivery.
          </p>
          <div className="flex mt-11">
            {stats.map((s, i) => (
              <div key={i}
                className={`flex-1 ${i > 0 ? "pl-6 border-l border-white/20" : ""} ${i < 2 ? "pr-6" : ""}`}>
                <div className="font-['Georgia',serif] text-[34px] font-bold text-white leading-none">{s.num}</div>
                <div className="text-sm mt-1 font-light text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div
        className={`flex-[0.9] flex items-center justify-center bg-white px-14 py-10
          transition-all duration-700 ease-out delay-150
          ${mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-7"}`}
      >
        <div className="w-full max-w-[340px]">

          {/* Header */}
          <div className="mb-7">
            {/* ↓ 14px → 11px */}
            <div className="text-[11px] font-semibold uppercase tracking-[2px] text-[#ff6b1a] mb-2">
              Welcome Back
            </div>
            {/* ↓ 38px → 30px */}
            <h2 className="font-['Georgia',serif] text-[30px] text-[#111] leading-[1.15] tracking-tight m-0">
              Sign in to<br/>your account
            </h2>
            {/* ↓ text-sm → text-xs (12px) */}
            <p className="text-xs text-[#aaa] mt-2 leading-relaxed mb-0">
              Enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="m-0">

            {/* Email */}
            <div className="mb-3">
              {/* ↓ 14px → 12px */}
              <label className="block text-[12px] font-semibold text-[#555] mb-1.5">Email Address</label>
              <div className="relative">
                <span className={`absolute top-1/2 -translate-y-1/2 left-[13px] pointer-events-none flex transition-colors duration-200 ${iconColor("email")}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M2 8L12 14L22 8" stroke="currentColor" strokeWidth="1.8"/>
                  </svg>
                </span>
                <input type="email" placeholder="you@company.com" value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  required className={inputCls("email")} />
              </div>
            </div>

            {/* Password */}
            <div className="mb-3">
              {/* ↓ 14px → 12px */}
              <label className="block text-[12px] font-semibold text-[#555] mb-1.5">Password</label>
              <div className="relative">
                <span className={`absolute top-1/2 -translate-y-1/2 left-[13px] pointer-events-none flex transition-colors duration-200 ${iconColor("password")}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <input type={showPassword ? "text" : "password"} placeholder="Enter your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  required className={`${inputCls("password")} pr-10`} />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute top-1/2 -translate-y-1/2 right-[12px] text-[#bbb] bg-transparent border-none cursor-pointer p-1 flex">
                  {showPassword
                    ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    : <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
                  }
                </button>
              </div>
            </div>

            {/* Remember / Forgot */}
            <div className="flex items-center justify-between mb-5 mt-1">
              {/* ↓ 15px → 12px */}
              <label className="flex items-center gap-2 cursor-pointer select-none text-[12px] text-[#888]">
                <input type="checkbox" checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                  className="w-3.5 h-3.5 cursor-pointer accent-[#ff6b1a]" />
                Remember me
              </label>
              {/* ↓ 15px → 12px */}
              <a href="#" className="text-[12px] font-semibold text-[#ff6b1a] no-underline">Forgot password?</a>
            </div>

            {/* Submit */}
            {/* ↓ text-[16px] → text-[14px], h-[52px] → h-[46px] */}
            <button type="submit" disabled={isLoading}
              className={`relative w-full h-[46px] text-[14px] font-bold text-white rounded-[13px] border-none
                flex items-center justify-center gap-2 overflow-hidden transition-all duration-[180ms]
                hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(255,107,26,.42)]
                ${isLoading ? "opacity-80 cursor-not-allowed" : "cursor-pointer"}`}
              style={{ background: "linear-gradient(135deg,#ff6b1a 0%,#ff4500 100%)", boxShadow: "0 6px 20px rgba(255,107,26,.35)" }}>
              <span className="absolute inset-0 rounded-[13px] pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,.18) 0%,transparent 60%)" }} />
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-[16px] h-[16px] border-[2.5px] border-white/35 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#f0f0f0]" />
            <span className="text-[10px] text-[#ccc] font-medium tracking-[1px]">OR</span>
            <div className="flex-1 h-px bg-[#f0f0f0]" />
          </div>

          {/* SSO */}
          {/* ↓ text-base → text-[13px], h-12 → h-[42px] */}
          <button className="w-full h-[42px] text-[13px] font-semibold text-[#555] rounded-xl
            border-[1.5px] border-[#e8e8e8] bg-white cursor-pointer
            flex items-center justify-center gap-2
            hover:border-[#ff6b1a] hover:bg-[#fffaf7]
            transition-[border-color,background] duration-200">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <rect x="3"  y="3"  width="8" height="8" rx="1.5" fill="#ff6b1a"/>
              <rect x="13" y="3"  width="8" height="8" rx="1.5" fill="#ff6b1a" opacity=".5"/>
              <rect x="3"  y="13" width="8" height="8" rx="1.5" fill="#ff6b1a" opacity=".5"/>
              <rect x="13" y="13" width="8" height="8" rx="1.5" fill="#ff6b1a" opacity=".25"/>
            </svg>
            Continue with SSO
          </button>

          {/* ↓ 14px → 12px */}
          <p className="text-center text-[12px] text-[#aaa] mt-6">
            Don't have an account?{" "}
            <a href="#" className="font-semibold text-[#ff6b1a] no-underline">Request Access</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartCargoLogin;