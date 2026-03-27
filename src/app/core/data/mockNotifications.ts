export type NotifType = 'order' | 'payment' | 'delivery' | 'alert' | 'info';

export interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;       // relative display string
  read: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'order',
    title: 'New Order Received',
    body: 'Kwame Mensah placed an order for Portland Cement × 10 bags.',
    time: '2 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'payment',
    title: 'Payment Confirmed',
    body: 'Order #RT-0042 has been marked as Paid via Mobile Money.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'delivery',
    title: 'Delivery Dispatched',
    body: 'Order #RT-0039 is now In Transit. Driver: Emmanuel Boateng.',
    time: '1 hr ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'alert',
    title: 'Low Stock Alert',
    body: 'Iron Rods 16mm is below the minimum stock threshold (8 units left).',
    time: '3 hr ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'order',
    title: 'Order Completed',
    body: 'Order #RT-0037 has been delivered and marked complete.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n6',
    type: 'info',
    title: 'New Dealer Registered',
    body: 'A new dealer account for "Accra Build Supplies" is pending approval.',
    time: 'Yesterday',
    read: true,
  },
  {
    id: 'n7',
    type: 'payment',
    title: 'Credit Limit Exceeded',
    body: 'Retailer Abena Osei has exceeded her credit limit by GHS 450.',
    time: '2 days ago',
    read: true,
  },
  {
    id: 'n8',
    type: 'delivery',
    title: 'Delivery Failed',
    body: 'Order #RT-0031 delivery attempt failed. Customer unreachable.',
    time: '2 days ago',
    read: true,
  },
];

export const NOTIF_CONFIG: Record<NotifType, { icon: string; color: string; bg: string; glow: string }> = {
  order:    { icon: 'solar:bag-5-bold',            color: '#D40073', bg: 'rgba(212,0,115,0.1)',   glow: 'rgba(212,0,115,0.25)' },
  payment:  { icon: 'solar:card-bold',             color: '#16A34A', bg: 'rgba(22,163,74,0.1)',   glow: 'rgba(22,163,74,0.25)'  },
  delivery: { icon: 'solar:delivery-bold',         color: '#2563EB', bg: 'rgba(37,99,235,0.1)',   glow: 'rgba(37,99,235,0.25)'  },
  alert:    { icon: 'solar:danger-triangle-bold',  color: '#D97706', bg: 'rgba(217,119,6,0.1)',   glow: 'rgba(217,119,6,0.25)'  },
  info:     { icon: 'solar:info-circle-bold',      color: '#7C3AED', bg: 'rgba(124,58,237,0.1)',  glow: 'rgba(124,58,237,0.25)' },
};
