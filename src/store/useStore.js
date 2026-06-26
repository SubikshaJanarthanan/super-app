import { create } from "zustand";

export const useStore = create((set) => ({
  user: null,
  categories: [],
  notes: localStorage.getItem("super_app_notes") || "",

  setUser: (userData) => set({ user: userData }),
  setCategories: (categoryArray) => set({ categories: categoryArray }),
  setNotes: (noteText) => {
    localStorage.setItem("super_app_notes", noteText);
    set({ notes: noteText });
  },
  resetStore: () => {
    localStorage.removeItem("super_app_notes");
    set({ user: null, categories: [], notes: "" });
  },
}));

export default useStore;