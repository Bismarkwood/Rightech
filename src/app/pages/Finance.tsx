import React from 'react';
import { Icon } from '@iconify/react';

export default function Finance() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <div className="w-16 h-16 rounded-[24px] bg-[#111111] text-white flex items-center justify-center">
        <Icon icon="solar:bill-list-bold-duotone" className="text-[32px]" />
      </div>
      <h1 className="text-[24px] font-black text-[#111111]">Finance Module</h1>
      <p className="text-[14px] font-medium text-[#525866] max-w-sm">
        Financial reporting and analytics are coming soon. This module will centralize all profit, loss, and expense tracking.
      </p>
    </div>
  );
}
