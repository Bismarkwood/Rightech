import React from 'react';
import { PaymentsWorkspace } from '../components/payments/PaymentsWorkspace';
import { TransactionDetailDrawer } from '../components/payments/TransactionDetailDrawer';

export default function PaymentManagement() {
  return (
    <>
      <PaymentsWorkspace />
      <TransactionDetailDrawer />
    </>
  );
}
