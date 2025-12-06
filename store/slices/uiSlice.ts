/** UI slice — TV mode, modals, focused row, mobile nav. Session-only. */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface UiState {
  /** Smart-TV mode: spatial navigation on, cursor hidden. */
  tvMode: boolean;
  /** Mobile nav drawer. */
  mobileNavOpen: boolean;
  /** Currently open modal id, if any. */
  activeModal: string | null;
  /** Focus key of the content row the user last interacted with. */
  focusedRow: string | null;
}

const initialState: UiState = {
  tvMode: false,
  mobileNavOpen: false,
  activeModal: null,
  focusedRow: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTvMode(state, action: PayloadAction<boolean>) {
      state.tvMode = action.payload;
    },
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNav(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    setFocusedRow(state, action: PayloadAction<string | null>) {
      state.focusedRow = action.payload;
    },
  },
});

export const {
  setTvMode,
  toggleMobileNav,
  setMobileNav,
  openModal,
  closeModal,
  setFocusedRow,
} = uiSlice.actions;
export default uiSlice.reducer;

/* Selectors */
import type { RootState } from "@/store";
export const selectTvMode = (state: RootState): boolean => state.ui.tvMode;
export const selectMobileNavOpen = (state: RootState): boolean => state.ui.mobileNavOpen;
export const selectActiveModal = (state: RootState): string | null => state.ui.activeModal;
