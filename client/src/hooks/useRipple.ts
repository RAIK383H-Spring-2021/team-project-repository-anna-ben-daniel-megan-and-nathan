import { Ripple } from "@material/mwc-ripple";
import { RippleHandlers } from "@material/mwc-ripple/ripple-handlers";
import { useEffect } from "react";

export function useRipple(
  parentElement: React.MutableRefObject<HTMLElement | null>,
  unbounded = false
) {
  useEffect(() => {
    const parent = parentElement.current;
    if (parent) {
      const ripple = new Ripple();
      ripple.unbounded = unbounded;
      const rh = new RippleHandlers(async () => ripple);
      parent.appendChild(ripple);
      parent.addEventListener("mouseenter", rh.startHover);
      parent.addEventListener("mouseleave", rh.endHover);
      parent.addEventListener("mousedown", (e) => {
        const onMouseUp = () => {
          window.removeEventListener("mouseup", onMouseUp);
          rh.endPress();
        };

        window.addEventListener("mouseup", onMouseUp);
        rh.startPress(e);
      });
      parent.addEventListener("touchstart", (e) => {
        const onTouchEnd = () => {
          window.removeEventListener("touchend", onTouchEnd);
          rh.endPress();
        };

        window.addEventListener("touchend", onTouchEnd);
        rh.startPress(e);
      });
      parent.addEventListener("focus", rh.startFocus);
      parent.addEventListener("blur", rh.endFocus);
    }
  });
}
