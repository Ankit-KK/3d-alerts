'use client';

import { useEffect } from 'react';
import { useDonationStore } from '@/store/useDonationStore';
import { sampleDonation } from '@/utils/sampleDonation';

export function useFakeWebSocket() {
  const addAlert = useDonationStore((s) => s.addAlert);

  useEffect(() => {
    const timeout = setTimeout(() => {
      addAlert(sampleDonation);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [addAlert]);
}
