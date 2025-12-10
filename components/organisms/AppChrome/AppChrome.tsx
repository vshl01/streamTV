"use client";

/**
 * App-level controller for Smart-TV behavior. Renders nothing.
 *
 *  - Initializes spatial navigation once (D-pad / arrow keys work everywhere).
 *  - Auto-enables TV mode on connected-TV devices (or via `?tv=1`).
 *  - Toggles the cursor-hiding `tv-mode` body class and seeds initial focus.
 *  - Sends Backspace to browser-back when in TV mode.
 */
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  doesFocusableExist,
  setFocus,
} from "@noriginmedia/norigin-spatial-navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectTvMode, setTvMode } from "@/store/slices/uiSlice";
import { initSpatialNavigation, FOCUS_KEYS } from "@/lib/spatial/navigationConfig";
import { useDeviceType } from "@/hooks/useDeviceType";

export function AppChrome() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const tvMode = useAppSelector(selectTvMode);
  const deviceType = useDeviceType();

  // One-time spatial-navigation init.
  useEffect(() => {
    initSpatialNavigation();
  }, []);

  // Auto-enable TV mode on TV-class devices.
  useEffect(() => {
    if (deviceType === "tv") dispatch(setTvMode(true));
  }, [deviceType, dispatch]);

  // Reflect TV mode on the body + seed focus.
  useEffect(() => {
    document.body.classList.toggle("tv-mode", tvMode);
    if (tvMode) {
      const seed = doesFocusableExist(FOCUS_KEYS.HERO_PLAY)
        ? FOCUS_KEYS.HERO_PLAY
        : undefined;
      if (seed) window.setTimeout(() => setFocus(seed), 80);
    }
    return () => document.body.classList.remove("tv-mode");
  }, [tvMode]);

  // Backspace navigates back in TV mode.
  useEffect(() => {
    if (!tvMode) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Backspace") {
        const target = event.target as HTMLElement | null;
        if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
        event.preventDefault();
        router.back();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tvMode, router]);

  return null;
}
