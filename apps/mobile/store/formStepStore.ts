// import { create } from 'zustand';

// type FormStore = {
//   currentIndex: number;
//   setCurrentIndex: (index: number) => void;
//   next: () => void;
//   prev: () => void;
// };

// // ✅ Important: pass dataLength from component when using store
// export const useFormStepStore = (dataLength: number) =>
//   create<FormStore>((set, get) => ({
//     currentIndex: 0,
//     setCurrentIndex: (index: number) => set({ currentIndex: index }),
//     next: () => {
//       const current = this.status.currentIndex;
//       set({
//         currentIndex: Math.min(current + 1, dataLength - 1),
//       });
//     },
//     prev: () => {
//       const current = get().currentIndex;
//       set({
//         currentIndex: Math.max(current - 1, 0),
//       });
//     },
//   }));
