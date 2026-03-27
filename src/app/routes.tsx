import { createBrowserRouter, Navigate } from "react-router";
import Auth from "./pages/Auth";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./pages/DashboardHome";
import BusinessManagement from "./pages/BusinessManagement";
import DealerManagement from "./pages/DealerManagement";
import SupplyManagement from "./pages/SupplyManagement";
import RetailerManagement from "./pages/RetailerManagement";
import RetailerOrderDetails from "./pages/RetailerOrderDetails";
import ConsignmentManagement from "./pages/ConsignmentManagement";
import StorefrontManagement from "./pages/StorefrontManagement";
import { DeliveryManagement } from "./components/delivery/DeliveryManagement";

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
      { path: "retailer", Component: RetailerManagement },
      { path: "retailer/orders/:orderId", Component: RetailerOrderDetails },
      { path: "dealer", Component: DealerManagement },
      { path: "delivery", Component: DeliveryManagement },
      { path: "supply", Component: SupplyManagement },
      { path: "consignment", Component: ConsignmentManagement }
    ]
  }
]);
