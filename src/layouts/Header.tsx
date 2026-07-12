import {
  Bell,
  ChevronRight,
  Menu,
  UserCircle2,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { sidebarMenu } from "./sidebar-menu";
import { useSidebarStore } from "../stores/sidebar.store";

function useBreadcrumb() {
  const { pathname } = useLocation();

  for (const section of sidebarMenu) {
    for (const item of section.items) {
      if (item.to === pathname) {
        return {
          sectionTitle: section.title,
          pageLabel: item.label,
          pagePath: item.to,
        };
      }
    }
  }

  // Fallback for root or unknown paths
  return {
    sectionTitle: "Overview",
    pageLabel: "Dashboard",
    pagePath: "/",
  };
}

export default function Header() {
  const breadcrumb = useBreadcrumb();
  const { openMobile } = useSidebarStore();

  return (
    <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
      <div className="flex items-center gap-2 min-w-0">
        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100 min-h-[44px] min-w-[44px] flex items-center justify-center"
          onClick={openMobile}
          aria-label="Open navigation"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm min-w-0">
          <Link
            to="/"
            className="text-slate-400 hover:text-indigo-600 transition-colors font-medium truncate max-w-[120px] md:max-w-none"
          >
            {breadcrumb.sectionTitle}
          </Link>
          <ChevronRight size={14} className="text-slate-300 shrink-0" />
          <span className="text-slate-800 font-semibold truncate">
            {breadcrumb.pageLabel}
          </span>
        </nav>
      </div>

      <div className="flex items-center gap-5">
        <button className="relative">
          <Bell />

          <span
            className="
              absolute
              -top-1
              -right-1
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button>

        <div className="flex items-center gap-2">
          <UserCircle2 size={34} />

          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">
              Atom
            </p>

            <p className="text-xs text-slate-500">
              Administrator
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}