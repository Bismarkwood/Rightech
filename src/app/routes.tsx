import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import Auth from './modules/auth/pages/Auth';
import DashboardLayout from './core/components/DashboardLayout';
const DashboardHome = lazy(() => import('./modules/retailer/pages/DashboardHome'));
const BusinessManagement = lazy(() => import('./modules/business/pages/BusinessManagement'));
const DealerManagement = lazy(() => import('./modules/dealer/pages/DealerManagement'));
const SupplyManagement = lazy(() => import('./modules/supply/pages/SupplyManagement'));
const RetailerManagement = lazy(() => import('./modules/retailer/pages/RetailerManagement'));
const ConsignmentManagement = lazy(() => import('./modules/consignment/pages/ConsignmentManagement'));
const StorefrontManagement = lazy(() => import('./modules/storefront/pages/StorefrontManagement'));
const PaymentManagement = lazy(() => import('./modules/payments/pages/PaymentManagement'));
const DeliveryManagement = lazy(() => import('./modules/delivery/pages/DeliveryManagement'));
const Shipments = lazy(() => import('./modules/shipment/pages/ShipmentManagement'));
const CreditManagement = lazy(() => import('./modules/credit/pages/CreditManagement'));
const Finance = lazy(() => import('./modules/finance/pages/Finance'));
const ProductManagement = lazy(() => import('./modules/products/pages/ProductManagement'));
const PublicTrackingPage = lazy(() => import('./modules/public/pages/TrackingPage'));

// Premium Loading Fallback
const ModuleLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-[#F7F7F8]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-[#D40073]/20 border-t-[#D40073] rounded-full animate-spin" />
      <p className="text-[14px] font-medium text-[#525866] animate-pulse">Initializing module...</p>
    </div>
  </div>
);

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
    path: "/track/:token",
    element: <Suspense fallback={<ModuleLoader />}><PublicTrackingPage /></Suspense>
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      { index: true, element: <Suspense fallback={<ModuleLoader />}><DashboardHome /></Suspense> },
      { path: "business", element: <Suspense fallback={<ModuleLoader />}><BusinessManagement /></Suspense> },
      { path: "storefront", element: <Suspense fallback={<ModuleLoader />}><StorefrontManagement /></Suspense> },
      { path: "payments", element: <Suspense fallback={<ModuleLoader />}><PaymentManagement /></Suspense> },
      { path: 'shipments', element: <Suspense fallback={<ModuleLoader />}><Shipments /></Suspense> },
      { path: 'credit', element: <Suspense fallback={<ModuleLoader />}><CreditManagement /></Suspense> },
      { path: 'finance', element: <Suspense fallback={<ModuleLoader />}><Finance /></Suspense> },
      { path: 'products', element: <Suspense fallback={<ModuleLoader />}><ProductManagement /></Suspense> },
      { path: "retailer", element: <Suspense fallback={<ModuleLoader />}><RetailerManagement /></Suspense> },
      { path: "dealer", element: <Suspense fallback={<ModuleLoader />}><DealerManagement /></Suspense> },
      { path: "delivery", element: <Suspense fallback={<ModuleLoader />}><DeliveryManagement /></Suspense> },
      { path: "supply", element: <Suspense fallback={<ModuleLoader />}><SupplyManagement /></Suspense> },
      { path: "consignment", element: <Suspense fallback={<ModuleLoader />}><ConsignmentManagement /></Suspense> }
    ]
  }
]);
