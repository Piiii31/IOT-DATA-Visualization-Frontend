import {create} from 'zustand';

type Store = {
  message: string;
  setMessage: (message: string) => void;
};

export const useStore = create<Store>((set) => ({
  message: '',
  setMessage: (message) => set({ message }),
}));