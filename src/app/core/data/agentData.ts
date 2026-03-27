export interface DeliveryAgent {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'bike' | 'van' | 'truck';
  licensePlate: string;
  status: 'active' | 'inactive';
  rating: string;
  deliveries: number;
}

export const MOCK_AGENTS: DeliveryAgent[] = [
  { id: 'AG-1021', name: 'James Osei', phone: '+233 24 111 2222', vehicleType: 'van', licensePlate: 'GW-4910-22', status: 'active', rating: '4.8', deliveries: 1240 },
  { id: 'AG-1054', name: 'Sandra Appiah', phone: '+233 55 444 3333', vehicleType: 'bike', licensePlate: 'M-GR-201-23', status: 'active', rating: '4.9', deliveries: 856 },
  { id: 'AG-1011', name: 'Emmanuel Tetteh', phone: '+233 20 987 6543', vehicleType: 'truck', licensePlate: 'GT-8812-19', status: 'inactive', rating: '4.5', deliveries: 412 },
];
