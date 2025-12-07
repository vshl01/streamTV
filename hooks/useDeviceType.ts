"use client";

/**
 * Detect the active device class: `mobile` | `desktop` | `tv`.
 *
 * TV mode is asserted when either the `?tv=1` query param is present or the
 * user agent looks like a connected-TV browser (Tizen, webOS, etc.). This is
 * what flips the app into spatial-navigation mode.
 */
import { useEffect, useState } from "react";

export type DeviceType = "mobile" | "desktop" | "tv";

const TV_UA = /(SMART-TV|SmartTV|Tizen|Web0S|WebOS|HbbTV|NetCast|VIDAA|BRAVIA|AppleTV|GoogleTV|CrKey)/i;
const MOBILE_MAX_WIDTH = 768;

/** Read the device type from the current environment (client-only). */
function detectDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";

  const params = new URLSearchParams(window.location.search);
  if (params.get("tv") === "1" || TV_UA.test(window.navigator.userAgent)) {
    return "tv";
  }
  return window.innerWidth <= MOBILE_MAX_WIDTH ? "mobile" : "desktop";
}

/**
 * Returns the current device type, re-evaluated on resize. SSR-safe: renders
 * `desktop` on the server and corrects after mount.
 */
export function useDeviceType(): DeviceType {
  const [deviceType, setDeviceType] = useState<DeviceType>("desktop");

  useEffect(() => {
    const update = () => setDeviceType(detectDeviceType());
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return deviceType;
}
