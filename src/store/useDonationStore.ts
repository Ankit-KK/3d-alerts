import { create } from 'zustand';

export interface DonationAlert {
  id: string;
  donorName: string;
  amount: number;
  message?: string;
  currency?: string;
}

interface DonationState {
  queue: DonationAlert[];
  activeAlert: DonationAlert | null;
  addAlert: (alert: DonationAlert) => void;
  setActiveAlert: (alert: DonationAlert | null) => void;
  processQueue: () => void;
}

export const useDonationStore = create<DonationState>((set, get) => ({
  queue: [],
  activeAlert: null,
  addAlert: (alert) =>
    set((state) => {
      if (!state.activeAlert) {
        return { activeAlert: alert };
      }
      return { queue: [...state.queue, alert] };
    }),
  setActiveAlert: (alert) => set({ activeAlert: alert }),
  processQueue: () => {
    const { queue, activeAlert } = get();
    if (activeAlert) return;
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      set({ activeAlert: next, queue: rest });
    }
  },
}));
