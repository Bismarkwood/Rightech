import React from 'react';
import { PaymentsWorkspace } from '../components/PaymentsWorkspace';
import { TransactionDetailDrawer } from '../components/TransactionDetailDrawer';

export default function PaymentManagement() {
  return (
    <>
      <PaymentsWorkspace />
      <TransactionDetailDrawer />
    </>
  );
}
