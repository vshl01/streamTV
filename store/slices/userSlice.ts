/** User profile + preferences slice. Auth is mocked with one profile. */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Preferences, Profile } from "@/types/user";
import type { Quality } from "@/types/player";

export interface UserState {
  profile: Profile;
  preferences: Preferences;
}

/** Hardcoded profile — user authentication is out of scope. */
export const DEFAULT_PROFILE: Profile = {
  id: "u-1",
  name: "Vishal",
  initials: "VV",
  avatarColor: "#7c5cff",
};

const initialState: UserState = {
  profile: DEFAULT_PROFILE,
  preferences: { preferredQuality: "auto", autoplay: true, captions: false },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** Replace the active profile. */
    setProfile(state, action: PayloadAction<Profile>) {
      state.profile = action.payload;
    },
    /** Patch one or more preference fields. */
    updatePreferences(state, action: PayloadAction<Partial<Preferences>>) {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    /** Convenience setter for the default playback quality. */
    setPreferredQuality(state, action: PayloadAction<Quality>) {
      state.preferences.preferredQuality = action.payload;
    },
  },
});

export const { setProfile, updatePreferences, setPreferredQuality } = userSlice.actions;
export default userSlice.reducer;

/* Selectors */
import type { RootState } from "@/store";
export const selectProfile = (state: RootState): Profile => state.user.profile;
export const selectPreferences = (state: RootState): Preferences => state.user.preferences;
