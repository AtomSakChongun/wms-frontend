import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useSidebarStore } from "@/stores/sidebar.store";

interface Props {
  item: {
    label: string;
    icon: any;
    to: string;
  };

  collapsed: boolean;
}

export default function SidebarItem({ item, collapsed }: Props) {
  const Icon = item.icon;
  const { closeMobile } = useSidebarStore();

  return (
    <NavLink
      to={item.to}
      onClick={closeMobile}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-xl px-3 py-2 transition-all",
          "hover:bg-slate-800",

          isActive &&
            "bg-indigo-600 text-white shadow",

          collapsed && "justify-center"
        )
      }
    >
      <Icon size={20} />

      {!collapsed && (
        <span className="text-sm font-medium">
          {item.label}
        </span>
      )}
    </NavLink>
  );
}