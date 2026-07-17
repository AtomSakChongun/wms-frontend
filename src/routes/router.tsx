import { createBrowserRouter } from "react-router-dom";

import MainLayout from "@/layouts/MainLayout";

import DashboardPage from "@/features/dashboard/DashboardPage";
import ProductPage from "@/features/products/ProductPage";
import ProductDetailPage from "@/features/products/ProductDetailPage";
import InventoryPage from "@/features/inventory/InventoryPage";
import ProductCreatePage from "@/features/productDetail/ProductDetail";
import InboundPage from "@/features/inbound/InboundPage";
import InboundDetailPage from "@/features/inboundDetail/InboundDetailPage";
import InboundFormPage from "@/features/inboundDetail/InboundFormPage";

export const router = createBrowserRouter([
  {
    element: <MainLayout />,

    children: [
      {
        path: "/",
        element: <DashboardPage />,
      },
      {
        path: "/products",
        element: <ProductPage />,
      },
      {
        path: "/products/new",
        element: <ProductCreatePage />,
      },
      {
        path: "/products/:sku/edit",
        element: <ProductCreatePage />,
      },
      {
        path: "/products/:sku",
        element: <ProductDetailPage />,
      },
      {
        path: "/inventory",
        element: <InventoryPage />,
      },
      {
        path: "/inbound",
        element: <InboundPage />,
      },
      { path: "/inbound/new", element: <InboundFormPage /> },
      { path: "/inbound/:lotId/edit", element: <InboundFormPage /> },
      { path: "/inbound/:lotId", element: <InboundDetailPage /> },
    ],
  },
]);
