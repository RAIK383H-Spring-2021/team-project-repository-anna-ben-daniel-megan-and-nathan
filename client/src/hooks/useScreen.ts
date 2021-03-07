import { useEffect, useState } from "react";

const SMALL_MAX = 600;
const MEDIUM_MAX = 1024;

type Size = "small" | "medium" | "large";

const queries = {
  small: `(max-width: ${SMALL_MAX}px)`,
  medium: `(max-width: ${MEDIUM_MAX}px) and (min-width: ${SMALL_MAX}px)`,
  large: `(min-width: ${MEDIUM_MAX}px)`,
};

export function useScreen() {
  const [size, setSize] = useState<Size>(getInitialSize());

  useEffect(() => {
    const smallChange = (e: MediaQueryListEvent) =>
      e.matches && setSize("small");
    const mediumChange = (e: MediaQueryListEvent) =>
      e.matches && setSize("medium");
    const largeChange = (e: MediaQueryListEvent) =>
      e.matches && setSize("large");

    const matchSmall = matchMedia(queries.small);
    const matchMedium = matchMedia(queries.medium);
    const matchLarge = matchMedia(queries.large);

    matchSmall.addEventListener("change", smallChange);
    matchMedium.addEventListener("change", mediumChange);
    matchLarge.addEventListener("change", largeChange);

    return () => {
      matchSmall.removeEventListener("change", smallChange);
      matchMedium.removeEventListener("change", mediumChange);
      matchLarge.removeEventListener("change", largeChange);
    };
  });

  return size;
}

function getInitialSize() {
  if (window.innerWidth < SMALL_MAX) {
    return "small";
  } else if (window.innerWidth < MEDIUM_MAX) {
    return "medium";
  } else {
    return "large";
  }
}
