import { AppTheme } from "./theme";

export function getColor(x: number, theme: AppTheme) {
  const cutoff1 = 4 / 3 + 1;
  const cutoff2 = (4 / 3) * 2 + 1;

  if (x < cutoff1) {
    return theme.colors.error.base;
  } else if (x < cutoff2) {
    return theme.colors.warning.base;
  } else {
    return theme.colors.accent.dark!;
  }
}
