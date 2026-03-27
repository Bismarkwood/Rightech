import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, Navigate } from "react-router";
import Auth from './modules/auth/pages/Auth';
import DashboardLayout from './core/components/DashboardLayout';
import DashboardHome from './modules/retailer/pages/DashboardHome';
import BusinessManagement from './modules/business/pages/BusinessManagement';
import DealerManagement from './modules/dealer/pages/DealerManagement';
import SupplyManagement from './modules/supply/pages/SupplyManagement';
import RetailerManagement from './modules/retailer/pages/RetailerManagement';
import ConsignmentManagement from './modules/consignment/pages/ConsignmentManagement';
import StorefrontManagement from './modules/storefront/pages/StorefrontManagement';
import PaymentManagement from './modules/payments/pages/PaymentManagement';
import { DeliveryManagement } from './modules/delivery/components/DeliveryManagement';

const Shipments = lazy(() => import('./modules/shipment/pages/ShipmentManagement'));
const CreditManagement = lazy(() => import('./modules/credit/pages/CreditManagement'));
const Finance = lazy(() => import('./modules/finance/pages/Finance'));
const ProductManagement = lazy(() => import('./modules/products/pages/ProductManagement'));

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
