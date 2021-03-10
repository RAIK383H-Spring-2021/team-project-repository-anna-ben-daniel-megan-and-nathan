import { PropsWithChildren } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  card: ({ color, borderless }) => {
    if (color === "background") {
      return {
        ...theme.typography.body,
        ...theme.colors.background.base,
        border: !borderless && `1px solid ${theme.colors.divider.base.color}`,
        borderRadius: 8,
        padding: 36,
      };
    } else {
      return {
        ...theme.typography.body,
        ...theme.colors[color].base,
        border: "none",
        borderRadius: 8,
        padding: 36,
      };
    }
  },
}));

export interface CardComponentProps {
  className?: string;
  color?: "background" | "primary" | "secondary" | "accent";
  borderless?: boolean;
}

export function Card(props: PropsWithChildren<CardComponentProps>) {
  const {
    className = "",
    color = "background",
    children,
    borderless = false,
  } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color, borderless });

  return <div className={`${classes.card} ${className}`}>{children}</div>;
}
