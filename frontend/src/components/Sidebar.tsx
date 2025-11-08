import { Link, useLocation } from "react-router-dom";
import {
  Scale,
  LayoutDashboard,
  FileText,
  MessageSquare,
  Mail,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Cases", href: "/cases", icon: FileText },
  { name: "Calendar & Tasks", href: "/calendar", icon: Calendar },
  { name: "AI Assistant", href: "/chat", icon: MessageSquare },
  { name: "Email History", href: "/email-history", icon: Mail },
];

export default function Sidebar() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-zinc-900/95 backdrop-blur-xl border-r border-zinc-800/50 transition-all duration-300 shadow-2xl shadow-black/50",
        sidebarOpen ? "w-72" : "w-[72px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-[73px] items-center justify-between px-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-purple-700 shadow-lg">
            <Scale className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Lexicase
              </h1>
              <p className="text-[11px] font-medium text-zinc-400 tracking-wide uppercase">
                Legal Intelligence
              </p>
            </div>
          )}
        </div>
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-zinc-800/50 transition-all duration-200"
          >
            <ChevronLeft
              className="h-4 w-4 text-zinc-400"
              strokeWidth={2.5}
            />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-[13px] font-semibold transition-all duration-300",
                isActive
                  ? // Active state — glowing glass effect
                    "bg-blue-500/15 border border-blue-400/20 text-blue-200 backdrop-blur-md shadow-[0_0_12px_rgba(59,130,246,0.2)]"
                  : // Inactive state — translucent hover effect
                    "text-zinc-400 hover:bg-zinc-800/30 hover:text-white hover:border hover:border-zinc-700/50 hover:backdrop-blur-sm"
              )}
            >
              <item.icon
                className={cn("h-5 w-5", sidebarOpen ? "" : "mx-auto")}
                strokeWidth={2.5}
              />
              {sidebarOpen && (
                <span className="tracking-tight">{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button when closed */}
      {!sidebarOpen && (
        <div className="px-3 pb-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-3 rounded-xl hover:bg-zinc-800/50 transition-all duration-200 flex items-center justify-center"
          >
            <ChevronRight
              className="h-4 w-4 text-zinc-400"
              strokeWidth={2.5}
            />
          </button>
        </div>
      )}

      {/* Footer */}
      {sidebarOpen && (
        <div className="border-t border-zinc-800/50 px-6 py-4">
          <div className="text-[11px] text-zinc-500">
            <p className="font-semibold text-zinc-300 tracking-wide">
              TEAM NIRVANA
            </p>
            <p className="mt-1 tracking-wide">Powered by ❤️</p>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook to get sidebar state for layout calculations
export function useSidebarLayout() {
  const [sidebarOpen] = useState(false);
  return {
    sidebarOpen,
    marginClass: sidebarOpen ? "ml-72" : "ml-[72px]",
  };
}
