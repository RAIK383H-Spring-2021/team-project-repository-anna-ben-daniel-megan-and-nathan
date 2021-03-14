import { Ripple } from "@material/mwc-ripple";
import { RippleHandlers } from "@material/mwc-ripple/ripple-handlers";
import { useEffect } from "react";

export function useRipple(
  parentElement: React.MutableRefObject<HTMLElement | null>,
  color: string,
  unbounded = false,
  cancel = false
) {
  useEffect(() => {
    const parent = parentElement.current;
    if (parent && !cancel) {
      const ripple = new Ripple();
      ripple.unbounded = unbounded;
      ripple.primary = true;
      parent.style.setProperty("--mdc-theme-primary", color);

      const rh = new RippleHandlers(async () => ripple);
      parent.appendChild(ripple);

      const listeners = [
        { event: "mouseenter", action: rh.startHover },
        { event: "mouseleave", action: rh.endHover },
        {
          event: "mousedown",
          action: (e: MouseEvent) => {
            const onMouseUp = () => {
              window.removeEventListener("mouseup", onMouseUp);
              rh.endPress();
            };

            window.addEventListener("mouseup", onMouseUp);
            rh.startPress(e);
          },
        },
        {
          event: "touchstart",
          action: (e: TouchEvent) => {
            const onTouchEnd = () => {
              window.removeEventListener("touchend", onTouchEnd);
              rh.endPress();
            };

            window.addEventListener("touchend", onTouchEnd);
            rh.startPress(e);
          },
        },
        {
          event: "focus",
          action: rh.startFocus,
        },
        {
          event: "blur",
          action: rh.endFocus,
        },
      ];

      listeners.forEach((listener) =>
        parent.addEventListener(listener.event, listener.action as any)
      );

      return () => {
        if (parent.contains(ripple)) {
          setTimeout(() => {
            parent.removeChild(ripple);
            listeners.forEach((listener) =>
              parent.removeEventListener(listener.event, listener.action as any)
            );
          }, 100);
        }
      };
    }
  });
}
