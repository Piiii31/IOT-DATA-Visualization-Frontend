import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MyState = {
  formData: FormData[];
  addFormData: (newFormData: FormData) => void;
  updateFormData: (index: number, updatedFormData: FormData) => void;
  deleteFormData: (index: number) => void;
};

const asyncStorageWrapper: PersistStorage<any> = {
  getItem: (name: string) => AsyncStorage.getItem(name).then((value: string | null) => JSON.parse(value || '')),
  setItem: (name: string, value: any) => AsyncStorage.setItem(name, JSON.stringify(value)),
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};

const createStore = persist<any>(
  (set) => ({
    formData: [],
    addFormData: (newFormData: FormData) => set((state: { formData: any; }) => ({ formData: [...state.formData, newFormData] })),
    updateFormData: (index: number, updatedFormData: FormData) => {
      console.log("updateFormData called with index:", index, "and updated form data:", updatedFormData);
      set((state: { formData: any; }) => {
        const updatedFormDatas = [...state.formData];
        updatedFormDatas[index] = updatedFormData;
        return { formData: updatedFormDatas };
      });
    },
    deleteFormData: (index: number) => set((state: { formData: any[]; }) => ({
      formData: state.formData.filter((_: any, i: number) => i !== index),
    })),
  }),
  {
    name: 'form-data-storage', // unique name
    storage: asyncStorageWrapper, // use AsyncStorage in React Native
  },
);

export const useFormStore = create(createStore);