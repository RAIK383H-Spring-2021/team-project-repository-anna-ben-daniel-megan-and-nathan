import { FC } from "react";
import { createUseStyles } from "react-jss";
import { useTheme } from "theming";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  container: {
    padding: 0,
    margin: 0,
    border: ({ type }) =>
      type === "contain" && `1px solid ${theme.colors.divider.base.color}`,
    borderRadius: ({ type }) => type === "contain" && 8,
    overflow: "hidden",
    listStyle: "none",
  },
}));

export interface ListComponentProps {
  type: "fill" | "contain";
  className?: string;
}

export const List: FC<ListComponentProps> = (props) => {
  const { type, className = "" } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, type });

  return (
    <ul className={`${classes.container} ${className}`}>{props.children}</ul>
  );
};
