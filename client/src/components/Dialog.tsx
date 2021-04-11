import { FC, useEffect, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  "@keyframes fadeIn": {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  "@keyframes fadeOut": {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  "@keyframes slideIn": {
    from: { transform: "translateY(100px)", opacity: 0 },
    to: { transform: "translateY(0)", opacity: 1 },
  },
  "@keyframes slideOut": {
    from: { transform: "translateY(0)", opacity: 1 },
    to: { transform: "translateY(100px)", opacity: 0 },
  },
  positioner: {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    zIndex: 999,
  },
  backdrop: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    animationName: ({ closing }) => (closing ? "$fadeOut" : "$fadeIn"),
    animationDuration: theme.transitions.timing.long,
    animationTimingFunction: "linear",
    animationFillMode: "forwards",
  },
  scrollWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    overflowY: "auto",
    animationName: ({ closing }) => (closing ? "$slideOut" : "$slideIn"),
    animationDuration: theme.transitions.timing.long,
    animationTimingFunction: theme.transitions.easing.default,
    display: "flex",
    animationFillMode: "forwards",
  },
  content: {
    ...theme.colors.background.base,
    margin: `20px auto`,
    width: 600,
    maxWidth: "100%",
    outline: "none",
    border: "none",
    borderRadius: 8,
  },
}));

export interface DialogComponentProps {
  open: boolean;
}

export const Dialog: FC<DialogComponentProps> = (props) => {
  const { open } = props;

  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(!open);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, closing });

  useEffect(() => {
    if (open && closed) {
      setClosed(false);
    }
    if (!open && !closed) {
      setClosing(true);
      setTimeout(() => {
        setClosing(false);
        setClosed(true);
      }, 500);
    }
  }, [open, closed]);

  if (closed) return null;

  return (
    <div className={classes.positioner}>
      <div className={classes.backdrop}></div>
      <div className={classes.scrollWrapper}>
        <dialog open className={classes.content}>
          {props.children}
        </dialog>
      </div>
    </div>
  );
};
