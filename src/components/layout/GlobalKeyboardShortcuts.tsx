"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export function GlobalKeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in inputs, textareas, or modifiers are pressed
      if (
        e.metaKey ||
        e.ctrlKey ||
        e.altKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Check if any modal is currently open
      const hasOpenModal = document.querySelector('[role="dialog"], .modal-open');
      if (hasOpenModal) return;

      const key = e.key.toLowerCase();
      switch (key) {
        case "t":
          if (pathname !== "/talk") router.push("/talk");
          break;
        case "v":
          if (pathname !== "/vocabulary") router.push("/vocabulary");
          break;
        case "l":
          if (pathname !== "/learn") router.push("/learn");
          break;
        case "p":
          if (pathname !== "/progress") router.push("/progress");
          break;
        case "s":
          if (pathname !== "/settings") router.push("/settings");
          break;
        case "d":
          if (pathname !== "/dashboard") router.push("/dashboard");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, pathname]);

  return null;
}
