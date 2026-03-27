import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Shipment, MOCK_SHIPMENTS, Carrier, MOCK_CARRIERS } from '../../../core/data/mockShipments';
import { useProducts } from '../../products/context/ProductContext';
import { useConsignment } from '../../consignment/context/ConsignmentContext';
import { toast } from 'sonner';

interface ShipmentContextType {
  shipments: Shipment[];
  carriers: Carrier[];
  addShipment: (shipment: Shipment) => void;
  updateShipmentStatus: (id: string, newStatus: Shipment['status'], notes?: string) => void;
  markAsArrived: (id: string, arrivalDate: string, notes: string) => void;
  addCarrier: (carrier: Carrier) => void;
  selectedShipmentId: string | null;
  openShipmentDetail: (id: string) => void;
  closeShipmentDetail: () => void;
}

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export function ShipmentProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(MOCK_SHIPMENTS);
  const [carriers, setCarriers] = useState<Carrier[]>(MOCK_CARRIERS);
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  
  const { adjustStock } = useProducts();
  const { inboundConsignments } = useConsignment();

  const openShipmentDetail = (id: string) => setSelectedShipmentId(id);
  const closeShipmentDetail = () => setSelectedShipmentId(null);

  const addShipment = (shipment: Shipment) => {
    setShipments(prev => [shipment, ...prev]);
  };

  const updateShipmentStatus = (id: string, newStatus: Shipment['status'], notes?: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        const updatedTimeline = [...s.timeline];
        const currentStageIdx = updatedTimeline.findIndex(t => !t.completed);
        if (currentStageIdx !== -1) {
          updatedTimeline[currentStageIdx] = { 
            ...updatedTimeline[currentStageIdx], 
            completed: true, 
            date: new Date().toISOString().split('T')[0] 
          };
        }
        return { ...s, status: newStatus, timeline: updatedTimeline, conditionNotes: notes };
      }
      return s;
    }));
  };

  const markAsArrived = useCallback((id: string, arrivalDate: string, notes: string) => {
    const shipmentRef = shipments.find(s => s.id === id);
    if (!shipmentRef) return;

    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        return { 
          ...s, 
          status: 'Arrived', 
          arrivalDate, 
          conditionNotes: notes,
          timeline: s.timeline.map(t => t.stage.toLowerCase().includes('arrived') ? { ...t, completed: true, date: arrivalDate } : t)
        };
      }
      return s;
    }));
    
    // Inventory Automation
    const consignment = inboundConsignments.find(c => c.id === shipmentRef.consignmentId);
    if (consignment) {
      consignment.items.forEach(item => {
        adjustStock(
          item.productId, 
          item.suppliedQty, 
          'Inbound', 
          `Shipment Arrival: ${shipmentRef.id}`, 
          shipmentRef.id
        );
      });
      toast.info(`Inventory incremented for ${consignment.items.length} items from ${consignment.name}`);
    }
  }, [shipments, inboundConsignments, adjustStock]);

  const addCarrier = (carrier: Carrier) => {
    setCarriers(prev => [...prev, carrier]);
  };

  return (
    <ShipmentContext.Provider value={{ 
      shipments, 
      carriers, 
      addShipment, 
      updateShipmentStatus, 
      markAsArrived,
      addCarrier,
      selectedShipmentId,
      openShipmentDetail,
      closeShipmentDetail
    }}>
      {children}
    </ShipmentContext.Provider>
  );
}

export function useShipments() {
  const context = useContext(ShipmentContext);
  if (context === undefined) {
    throw new Error('useShipments must be used within a ShipmentProvider');
  }
  return context;
}
