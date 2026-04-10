import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import Auth from './modules/auth/pages/Auth';
import DashboardLayout from './core/components/DashboardLayout';
import { ProtectedRoute } from './core/components/ProtectedRoute';
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
const TeamManagement = lazy(() => import('./modules/team/pages/TeamManagement'));

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
      { path: "business", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="business"><BusinessManagement /></ProtectedRoute></Suspense> },
      { path: "storefront", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="storefront"><StorefrontManagement /></ProtectedRoute></Suspense> },
      { path: "payments", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="payments"><PaymentManagement /></ProtectedRoute></Suspense> },
      { path: 'shipments', element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="shipments"><Shipments /></ProtectedRoute></Suspense> },
      { path: 'credit', element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="credit"><CreditManagement /></ProtectedRoute></Suspense> },
      { path: 'finance', element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="finance"><Finance /></ProtectedRoute></Suspense> },
      { path: 'products', element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="products"><ProductManagement /></ProtectedRoute></Suspense> },
      { path: "retailer", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="retailer"><RetailerManagement /></ProtectedRoute></Suspense> },
      { path: "dealer", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="dealer"><DealerManagement /></ProtectedRoute></Suspense> },
      { path: "delivery", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="delivery"><DeliveryManagement /></ProtectedRoute></Suspense> },
      { path: "supply", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="supply"><SupplyManagement /></ProtectedRoute></Suspense> },
      { path: "consignment", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="consignment"><ConsignmentManagement /></ProtectedRoute></Suspense> },
      { path: "team", element: <Suspense fallback={<ModuleLoader />}><ProtectedRoute permission="team"><TeamManagement /></ProtectedRoute></Suspense> }
    ]
  }
]);
