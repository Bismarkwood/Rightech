import React from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router';
import { Icon } from '@iconify/react';
import { motion } from 'motion/react';
import { RightTechLogo } from '../../modules/auth/pages/Auth';
import { NotificationCenter } from './NotificationCenter';
import { RetailerProvider } from '../../modules/retailer/components/RetailerContext';
import { ConsignmentProvider } from '../../modules/consignment/context/ConsignmentContext';
import { OrderWorkflowProvider } from '../../modules/orders/components/OrderWorkflowContext';
import { PaymentProvider } from '../../modules/payments/context/PaymentContext';
import { ShipmentProvider } from '../../modules/shipment/context/ShipmentContext';
import { CreditProvider } from '../../modules/credit/context/CreditContext';
import { ProductProvider } from '../../modules/products/context/ProductContext';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { SupplierProvider } from '../../modules/supply/context/SupplierContext';
import { DeliveryProvider } from '../../modules/delivery/context/DeliveryContext';
import { OrderManagementProvider } from '../../modules/orders/context/OrderManagementContext';
import { DealerWorkflowProvider } from '../../modules/dealer/components/DealerWorkflowContext';
import { AddSupplierModal } from '../../modules/retailer/components/AddSupplierModal';
import { NewOrderModal } from '../../modules/retailer/components/NewOrderModal';

const NAVIGATION = [
  {
    group: 'General',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'solar:widget-5-linear', path: '/dashboard' },
      { id: 'dealer', label: 'Dealer Manager', icon: 'solar:users-group-two-rounded-linear', path: '/dashboard/dealer' },
      { id: 'retailer', label: 'Order Management', icon: 'solar:cart-large-2-linear', path: '/dashboard/retailer' },
      { id: 'products', label: 'Products', icon: 'solar:box-minimalistic-linear', path: '/dashboard/products' },
      { id: 'supply', label: 'Supply', icon: 'solar:box-minimalistic-linear', path: '/dashboard/supply' },
      { id: 'consignment', label: 'Consignments', icon: 'solar:box-bold-duotone', path: '/dashboard/consignment' },
      { id: 'storefront', label: 'Storefront', icon: 'solar:shop-2-linear', path: '/dashboard/storefront' },
      { id: 'delivery', label: 'Delivery Agent', icon: 'solar:delivery-linear', path: '/dashboard/delivery' },
      { id: 'payments', label: 'Payments', icon: 'solar:card-2-linear', path: '/dashboard/payments' },
      { id: 'shipments', label: 'Shipments', icon: 'solar:box-minimalistic-linear', path: '/dashboard/shipments' },
      { id: 'credit', label: 'Credit', icon: 'solar:chart-square-linear', path: '/dashboard/credit' },
    ]
  },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="w-[260px] h-full bg-white border-r border-[#ECEDEF] flex-col hidden lg:flex shrink-0 z-10">
      <div className="h-[72px] px-6 flex items-center border-b border-[#ECEDEF]">
        <RightTechLogo />
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
        {NAVIGATION.map((group) => (
          <div key={group.group}>
            <h4 className="text-[12px] font-semibold text-[#8B93A7] tracking-tight uppercase mb-3 px-2">
              {group.group}
            </h4>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' && location.pathname.startsWith(`${item.path}/`)) ||
                  (item.path === '/dashboard' && location.pathname === '/dashboard');
                return (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-[10px] transition-all duration-200 relative overflow-hidden group ${
                      isActive 
                        ? 'bg-gradient-to-r from-[rgba(212,0,115,0.08)] to-transparent text-[#D40073] font-semibold' 
                        : 'text-[#111111] hover:bg-[#F3F4F6] font-medium'
                    }`}
                  >
                    {isActive && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[#D40073] to-[#B3005F] rounded-r-full" />}
                    <Icon 
                      icon={isActive ? item.icon.replace('-linear', '-bold') : item.icon} 
                      className={`text-[20px] ${isActive ? 'text-[#D40073]' : 'text-[#525866] group-hover:text-[#111111] transition-colors'}`} 
                    />
                    <span className="text-[14px]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Topbar = () => {
  return (
    <div className="h-[72px] bg-white border-b border-[#ECEDEF] flex items-center justify-between px-8 shrink-0 z-10">
      <div className="flex items-center">
        <h1 className="text-[20px] font-semibold text-[#111111] tracking-tight">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group hidden md:block">
          <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B93A7] group-focus-within:text-[#D40073] transition-colors text-[18px]" />
          <input 
            type="text" 
            placeholder="Search everywhere..." 
            className="w-[320px] h-10 pl-10 pr-4 bg-[#F3F4F6] border border-transparent rounded-[10px] text-[14px] text-[#111111] placeholder:text-[#8B93A7] focus:outline-none focus:bg-white focus:border-[#D40073] focus:ring-[3px] focus:ring-[rgba(212,0,115,0.1)] transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <NotificationCenter />
        </div>

        <div className="h-8 w-[1px] bg-[#ECEDEF] mx-1"></div>

        <button className="flex items-center gap-3 hover:opacity-80 transition-opacity group">
          <div className="w-9 h-9 rounded-full bg-[#1A1C23] overflow-hidden border border-[#ECEDEF]">
            <img src="https://i.pravatar.cc/100?img=33" alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[13px] font-semibold text-[#111111] leading-tight">Kwame Asante</p>
            <p className="text-[12px] text-[#525866] leading-tight">Master Admin</p>
          </div>
          <Icon icon="solar:alt-arrow-down-linear" className="text-[#8B93A7] group-hover:text-[#111111] transition-colors text-[16px]" />
        </button>
      </div>
    </div>
  );
};

export default function DashboardLayout() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProductProvider>
          <SupplierProvider>
            <ConsignmentProvider>
              <CreditProvider>
                <PaymentProvider>
                  <ShipmentProvider>
                    <OrderManagementProvider>
                      <DealerWorkflowProvider>
                        <RetailerProvider>
                          <OrderWorkflowProvider>
                            <DeliveryProvider>
                              <div className="flex h-screen w-full bg-[#F7F7F8] font-sans overflow-hidden">
                                <Sidebar />
                                <div className="flex-1 flex flex-col min-w-0 h-full relative">
                                  <Topbar />
                                  <main className="flex-1 h-full flex flex-col overflow-hidden">
                                    <Outlet />
                                  </main>
                                  
                                  {/* Global Modals */}
                                  <AddSupplierModal />
                                  <NewOrderModal />
                                </div>
                              </div>
                            </DeliveryProvider>
                          </OrderWorkflowProvider>
                        </RetailerProvider>
                      </DealerWorkflowProvider>
                    </OrderManagementProvider>
                  </ShipmentProvider>
                </PaymentProvider>
              </CreditProvider>
            </ConsignmentProvider>
          </SupplierProvider>
        </ProductProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}
