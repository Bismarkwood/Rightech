import React from 'react';
import { ShipmentWorkspace } from '../components/shipments/ShipmentWorkspace';
import { ShipmentDetailDrawer } from '../components/shipments/ShipmentDetailDrawer';

export default function ShipmentManagement() {
  return (
    <>
      <ShipmentWorkspace />
      <ShipmentDetailDrawer />
    </>
  );
}
