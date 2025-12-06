/** Playback state slice — current title, playhead, volume, quality. */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PlaybackState, PlaybackStatus, Quality } from "@/types/player";

const initialState: PlaybackState = {
  activeSlug: null,
  status: "idle",
  currentTime: 0,
  duration: 0,
  volume: 1,
  muted: false,
  quality: "auto",
  fullscreen: false,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    /** Load a title into the player and reset the playhead. */
    loadTitle(state, action: PayloadAction<string>) {
      state.activeSlug = action.payload;
      state.status = "loading";
      state.currentTime = 0;
      state.duration = 0;
    },
    setStatus(state, action: PayloadAction<PlaybackStatus>) {
      state.status = action.payload;
    },
    setProgress(state, action: PayloadAction<{ currentTime: number; duration: number }>) {
      state.currentTime = action.payload.currentTime;
      state.duration = action.payload.duration;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = Math.min(1, Math.max(0, action.payload));
      if (state.volume > 0) state.muted = false;
    },
    toggleMute(state) {
      state.muted = !state.muted;
    },
    setQuality(state, action: PayloadAction<Quality>) {
      state.quality = action.payload;
    },
    setFullscreen(state, action: PayloadAction<boolean>) {
      state.fullscreen = action.payload;
    },
    /** Tear down playback state when leaving the player. */
    resetPlayer() {
      return initialState;
    },
  },
});

export const {
  loadTitle,
  setStatus,
  setProgress,
  setVolume,
  toggleMute,
  setQuality,
  setFullscreen,
  resetPlayer,
} = playerSlice.actions;
export default playerSlice.reducer;

/* Selectors */
import type { RootState } from "@/store";
export const selectPlayer = (state: RootState): PlaybackState => state.player;
export const selectActiveSlug = (state: RootState): string | null => state.player.activeSlug;
export const selectIsPlaying = (state: RootState): boolean => state.player.status === "playing";
