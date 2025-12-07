"use client";

/**
 * Bind a map of keyboard shortcuts to the window while `enabled` is true.
 *
 * Keys are matched case-insensitively against `KeyboardEvent.key` (e.g. `" "`,
 * `"ArrowRight"`, `"f"`, `"m"`). Handlers receive the event so they can
 * `preventDefault()`. Used by the video player.
 */
import { useEffect, useRef } from "react";

export type ShortcutMap = Record<string, (event: KeyboardEvent) => void>;

export function useKeyboardShortcuts(shortcuts: ShortcutMap, enabled = true): void {
  // Keep the latest handlers without rebinding the listener every render.
  const handlersRef = useRef(shortcuts);
  useEffect(() => {
    handlersRef.current = shortcuts;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      // Don't hijack typing in inputs / textareas / contenteditable.
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      const handler =
        handlersRef.current[event.key] ?? handlersRef.current[event.key.toLowerCase()];
      if (handler) handler(event);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enabled]);
}
