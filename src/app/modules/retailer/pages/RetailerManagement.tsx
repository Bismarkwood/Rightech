import React from 'react';
import { RetailerWorkspace } from '../components/RetailerWorkspace';
import { RetailerProvider } from '../components/RetailerContext';

export default function RetailerManagement() {
  return (
    <RetailerProvider>
      <RetailerWorkspace />
    </RetailerProvider>
  );
}