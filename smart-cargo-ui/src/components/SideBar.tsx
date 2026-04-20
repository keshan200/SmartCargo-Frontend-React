import { FenceIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  path:string
};

const LayoutDashboard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const PackageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const TrackingIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13" />
    <polygon points="22 2 15 22 11 13 2 9 22 2" />
  </svg>
);

// Fleet icon — Truck
const FleetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1.5" />
    <path d="M16 8h4l3 4.5V16h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// Hubs icon — Warehouse / Building
const HubsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const UsersIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const BarChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const FileTextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

// Fleet & Hubs — two icons side by side with a divider




const mainMenuItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard /> ,path:"/dashboard"},
  { id: "shipments", label: "Shipments", icon: <PackageIcon />, badge: 48 ,path:"/shipments"},
  { id: "tracking", label: "Live Tracking", icon: <TrackingIcon />, path:"/tracking"},
  { id: "fleet", label: "Fleet ", icon: <FleetIcon />, path:"/fleet"},
  { id: "hubs", label: " Hubs", icon: <HubsIcon />, path:"/hubs"},
  { id: "users", label: "Users", icon: <UsersIcon />, path:"/users"},
];

const reportItems: NavItem[] = [
  { id: "analytics", label: "Analytics", icon: <BarChartIcon /> ,path:"/analytics"},
  { id: "reports", label: "Reports", icon: <FileTextIcon />, path:"/reports" },
];

type NavButtonProps = {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
};

const NavButton = ({ item, isActive, onClick }: NavButtonProps) => (
  <li>
    <Link
      onClick={onClick}
      className={`
        group flex w-full items-center gap-3 rounded-2xl px-4 py-3
        text-base transition-all duration-200 cursor-pointer
        ${isActive
          ? "bg-orange-50 text-orange-500"
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}
      `}
      style={{ fontWeight: isActive ? 600 : 500 }}
      to={item.path}  
    >
      <span
        className={`flex items-center flex-shrink-0 transition-all duration-200 ${
          isActive ? "text-orange-500" : "text-gray-400 group-hover:text-gray-600"
        }`}
      >
        {item.icon}
      </span>
      <span className="flex-1 text-left">{item.label}</span>
      {item.badge !== undefined && (
        <span
          className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-xs text-white"
          style={{ fontWeight: 600 }}
        >
          {item.badge}
        </span>
      )}
    </Link>
  </li>
);

const Sidebar = () => {
  const [active, setActive] = useState("dashboard");
  

  return (
    <div
      style={{ fontFamily: "'DM Sans', 'Nunito', sans-serif" }}
      className="flex h-screen w-72 flex-col bg-white border-r border-gray-100 shadow-sm"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 shadow-lg shadow-orange-200">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <rect x="1" y="3" width="15" height="13" rx="1.5" fill="white" fillOpacity="0.9" />
            <path d="M16 8h4l3 4.5V16h-7V8z" fill="white" fillOpacity="0.7" />
            <circle cx="5.5" cy="18.5" r="2.5" fill="white" />
            <circle cx="18.5" cy="18.5" r="2.5" fill="white" />
          </svg>
        </div>
        <div className="text-2xl tracking-tight">
          <span className="text-gray-900" style={{ fontWeight: 700 }}>Smart</span>
          <span className="text-orange-500" style={{ fontWeight: 700 }}>Cargo</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-4 pb-4">
        <p
          className="mb-3 mt-2 px-3 text-xs text-gray-400 uppercase"
          style={{ letterSpacing: "0.12em", fontWeight: 500 }}
        >
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {mainMenuItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </ul>

        <p
          className="mb-3 mt-7 px-3 text-xs text-gray-400 uppercase"
          style={{ letterSpacing: "0.12em", fontWeight: 500 }}
        >
          Reports
        </p>
        <ul className="space-y-0.5">
          {reportItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={active === item.id}
              onClick={() => setActive(item.id)}
            />
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mx-6 border-t border-gray-100" />

      {/* User Profile */}
      <div className="flex items-center gap-3.5 px-5 py-5">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white text-sm shadow-md shadow-orange-200 flex-shrink-0"
          style={{ fontWeight: 600 }}
        >
          AK
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-base text-gray-800" style={{ fontWeight: 600 }}>
            Ashan Karunaratne
          </p>
          <p className="text-sm text-gray-400" style={{ fontWeight: 400 }}>
            Administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;