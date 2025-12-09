"use client";

/**
 * Top-navigation entry. Spatially focusable and keyboard/click navigable.
 * Highlights when its href matches the current route.
 */
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { FocusableDiv } from "@/components/atoms/FocusableDiv";
import { Icon, type IconName } from "@/components/atoms/Icon";
import { FOCUS_KEYS } from "@/lib/spatial/navigationConfig";

export interface NavItemProps {
  href: string;
  label: string;
  /** Stable id used for the focus key. */
  id: string;
  icon?: IconName;
  /** Force active state; otherwise derived from the pathname. */
  active?: boolean;
}

export function NavItem({ href, label, id, icon, active }: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isActive = active ?? (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <FocusableDiv
      focusKey={FOCUS_KEYS.NAV_ITEM(id)}
      ariaLabel={label}
      onSelect={() => router.push(href)}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        isActive ? "text-ink" : "text-ink-muted hover:text-ink",
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {icon && <Icon name={icon} size={16} />}
        {label}
      </span>
    </FocusableDiv>
  );
}
