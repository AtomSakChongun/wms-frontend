import { Package2, ChevronLeft, ChevronRight } from "lucide-react";
import { sidebarMenu } from "./sidebar-menu";
import SidebarItem from "@/components/sidebar/SidebarItem";
import { useSidebarStore } from "@/stores/sidebar.store";
import { cn } from "@/utils/cn";

export default function Sidebar() {
  const { collapsed, toggle, mobileOpen, closeMobile } = useSidebarStore();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeMobile}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 h-screen bg-slate-950 text-white border-r border-slate-800 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:translate-x-0 md:flex md:flex-col",
          collapsed ? "md:w-20" : "md:w-72"
        )}
      >
      {/* Logo */}

      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <Package2 className="text-indigo-400" />

            <div>
              <h1 className="font-bold">Fruit WMS</h1>

              <p className="text-xs text-slate-400">
                Warehouse System
              </p>
            </div>
          </div>
        )}

        <button
          onClick={toggle}
          className="rounded-lg p-2 hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* Menu */}

      <div className="overflow-y-auto h-[calc(100vh-64px)] px-3 py-4 space-y-6">
        {sidebarMenu.map((group) => (
          <div key={group.title}>
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs uppercase tracking-wider text-slate-500">
                {group.title}
              </h3>
            )}

            <div className="space-y-1">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.to}
                  item={item}
                  collapsed={collapsed}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      </aside>
    </>
  );
}
