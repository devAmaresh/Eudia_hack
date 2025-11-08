import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Layout() {
  const [sidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950">
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-72" : "ml-[72px]"
        )}
      >
        <Outlet />
      </div>
    </div>
  );
}
