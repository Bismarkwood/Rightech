import React from 'react';
import { ShipmentWorkspace } from '../components/ShipmentWorkspace';
import { ShipmentDetailDrawer } from '../components/ShipmentDetailDrawer';

export default function ShipmentManagement() {
  return (
    <>
      <ShipmentWorkspace />
      <ShipmentDetailDrawer />
    </>
  );
}
