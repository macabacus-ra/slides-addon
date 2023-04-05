import { create } from 'zustand'

const initialState = {
    colors: 0,
    hasChanged: false,
}

export const recolorStore = create((set) => ({
    ...initialState,
    increase: () => set((state) => ({ colors: state.colors + 1 })),
    decrease: () => set((state) => ({ colors: state.colors - 1 })),
    reset: () => set((state) => (initialState))
}))