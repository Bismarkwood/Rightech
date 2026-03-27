import React from 'react';
import { RetailerWorkspace } from '../components/retailer/RetailerWorkspace';
import { RetailerOrderDetailsDrawer } from '../components/retailer/RetailerOrderDetailsDrawer';

export default function RetailerManagement() {
  return (
    <>
      <RetailerWorkspace />
      <RetailerOrderDetailsDrawer />
    </>
  );
}