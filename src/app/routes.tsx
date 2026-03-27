import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import BusinessManagement from "./pages/BusinessManagement";
import DealerManagement from "./pages/DealerManagement";
import SupplyManagement from "./pages/SupplyManagement";
import RetailerManagement from "./pages/RetailerManagement";
import ConsignmentManagement from "./pages/ConsignmentManagement";
import StorefrontManagement from "./pages/StorefrontManagement";
import PaymentManagement from "./pages/PaymentManagement";
import { DeliveryManagement } from "./components/delivery/DeliveryManagement";

const Shipments = lazy(() => import('./pages/ShipmentManagement'));
const CreditManagement = lazy(() => import('./pages/CreditManagement'));
const Finance = lazy(() => import('./pages/Finance'));
const ProductManagement = lazy(() => import('./pages/ProductManagement'));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth" replace />
  },
  {
    path: "/auth",
    Component: Auth
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardHome },
      { path: "business", Component: BusinessManagement },
      { path: "storefront", Component: StorefrontManagement },
      { path: "payments", Component: PaymentManagement },
      { path: 'shipments', element: <Suspense fallback={<div>Loading...</div>}><Shipments /></Suspense> },
      { path: 'credit', element: <Suspense fallback={<div>Loading...</div>}><CreditManagement /></Suspense> },
      { path: 'finance', element: <Suspense fallback={<div>Loading...</div>}><Finance /></Suspense> },
      { path: 'products', element: <Suspense fallback={<div>Loading...</div>}><ProductManagement /></Suspense> },
      { path: "retailer", Component: RetailerManagement },
      { path: "dealer", Component: DealerManagement },
      { path: "delivery", Component: DeliveryManagement },
      { path: "supply", Component: SupplyManagement },
      { path: "consignment", Component: ConsignmentManagement }
    ]
  }
]);
