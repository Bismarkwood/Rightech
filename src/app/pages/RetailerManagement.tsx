import React from 'react';
import { RetailerWorkspace } from '../components/retailer/RetailerWorkspace';
import { RetailerOrderDetailsDrawer } from '../components/retailer/RetailerOrderDetailsDrawer';
import { RetailerProvider } from '../components/retailer/RetailerContext';

export default function RetailerManagement() {
  return (
    <RetailerProvider>
      <RetailerWorkspace />
      <RetailerOrderDetailsDrawer />
    </RetailerProvider>
  );
}