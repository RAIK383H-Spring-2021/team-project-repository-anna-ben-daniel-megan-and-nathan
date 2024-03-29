import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

function getColor(theme: AppTheme, color: string) {
  if (color === "foreground") {
    return theme.colors.background.base.color;
  } else {
    return theme.colors[color].base.backgroundColor;
  }
}

const useStyles = createUseStyles((theme: AppTheme) => ({
  divider: {
    border: "none",
    borderTop: ({ color }) => `1px solid ${getColor(theme, color)}`,
    margin: 0,
    padding: 0,
  },
}));

export interface DividerComponentProps {
  color?: "primary" | "secondary" | "accent" | "divider" | "foreground";
  className?: string;
}

export const Divider: FC<DividerComponentProps> = (props) => {
  const { color = "divider", className = "" } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color });
  return <hr className={`${classes.divider} ${className}`.trim()} />;
};
