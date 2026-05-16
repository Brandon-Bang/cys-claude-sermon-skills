"use client";

import { create } from "zustand";
import { DEFAULT_MODEL_ID, isKnownModel } from "./models";

type Device = "desktop" | "tablet" | "phone";

interface UiState {
  device: Device;
  setDevice: (d: Device) => void;

  openAccordion: string | null;
  toggleAccordion: (catId: string) => void;
  setOpenAccordion: (catId: string | null) => void;

  flashCategory: string | null;
  flash: (catId: string) => void;

  /** Selected Claude model id used for all skill executions. */
  model: string;
  setModel: (id: string) => void;
  /** Set once on mount with the value hydrated from localStorage. */
  hydrateModel: () => void;
}

const MODEL_STORAGE_KEY = "sermon-skills:model";

export const useUi = create<UiState>((set) => ({
  device: "desktop",
  setDevice: (d) => set({ device: d }),

  openAccordion: "planning",
  toggleAccordion: (catId) =>
    set((s) => ({ openAccordion: s.openAccordion === catId ? null : catId })),
  setOpenAccordion: (catId) => set({ openAccordion: catId }),

  flashCategory: null,
  flash: (catId) => {
    set({ flashCategory: catId, openAccordion: catId });
    setTimeout(() => set({ flashCategory: null }), 800);
  },

  model: DEFAULT_MODEL_ID,
  setModel: (id) => {
    if (!isKnownModel(id)) return;
    set({ model: id });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(MODEL_STORAGE_KEY, id);
      } catch {
        // ignore quota / privacy-mode errors
      }
    }
  },
  hydrateModel: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(MODEL_STORAGE_KEY);
      if (isKnownModel(saved)) set({ model: saved });
    } catch {
      // ignore
    }
  },
}));
