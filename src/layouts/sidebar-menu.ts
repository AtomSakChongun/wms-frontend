import {
  LayoutDashboard,
  Truck,
  Package,
  Boxes,
  Warehouse,
  MapPinned,
  ScanLine,
  ClipboardList,
  ArrowRightLeft,
  ShoppingCart,
  BarChart3,
  Users,
  ShieldCheck,
  Settings,
} from "lucide-react";

export const sidebarMenu = [
  {
    title: "Overview",

    items: [
      {
        label: "Dashboard",
        icon: LayoutDashboard,
        to: "/",
      },
    ],
  },

  {
    title: "Operations",

    items: [
      {
        label: "Inbound",
        icon: Truck,
        to: "/inbound",
      },

      {
        label: "Receiving",
        icon: Package,
        to: "/receiving",
      },

      {
        label: "Picking",
        icon: ClipboardList,
        to: "/picking",
      },

      {
        label: "Packing",
        icon: Boxes,
        to: "/packing",
      },

      {
        label: "Shipping",
        icon: Truck,
        to: "/shipping",
      },

      {
        label: "Transfer",
        icon: ArrowRightLeft,
        to: "/transfer",
      },
    ],
  },

  {
    title: "Inventory",

    items: [
      {
        label: "Inventory",
        icon: Warehouse,
        to: "/inventory",
      },

      {
        label: "Products",
        icon: Package,
        to: "/products",
      },

      {
        label: "Locations",
        icon: MapPinned,
        to: "/locations",
      },

      {
        label: "Barcode",
        icon: ScanLine,
        to: "/barcode",
      },
    ],
  },

  {
    title: "Commerce",

    items: [
      {
        label: "Purchase Orders",
        icon: ShoppingCart,
        to: "/purchase-orders",
      },
    ],
  },

  {
    title: "Analytics",

    items: [
      {
        label: "Reports",
        icon: BarChart3,
        to: "/reports",
      },
    ],
  },

  {
    title: "Master Data",

    items: [
      {
        label: "Product Catagory",
        icon: Package,
        to: "/productcatagory",
      },
    ],
  },

  {
    title: "Administration",

    items: [
      {
        label: "Users",
        icon: Users,
        to: "/users",
      },

      {
        label: "Role Permissions",
        icon: ShieldCheck,
        to: "/roles",
      },

      {
        label: "Settings",
        icon: Settings,
        to: "/settings",
      },
    ],
  },
];
