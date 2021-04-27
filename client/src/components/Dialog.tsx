import { FC, useEffect, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useScreen } from "../hooks/useScreen";
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
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    animationName: ({ closing }) => (closing ? "$fadeOut" : "$fadeIn"),
    animationDuration: theme.transitions.timing.normal,
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
    animationDuration: theme.transitions.timing.normal,
    animationTimingFunction: theme.transitions.easing.default,
    display: "flex",
    animationFillMode: "forwards",
  },
  contentWrapper: {
    display: "flex",
    width: "100%",
  },
  content: {
    ...theme.colors.background.base,
    background: theme.colors.background.base.backgroundColor,
    width: 600,
    maxWidth: "100%",
    display: "block",
    outline: "none",
    border: ({ size }) =>
      size === "small"
        ? "none"
        : theme.name === "dark"
        ? `2px solid ${theme.colors.divider.base.backgroundColor}`
        : "none",
    borderRadius: 8,
    borderBottomLeftRadius: ({ size }) => size === "small" && 0,
    borderBottomRightRadius: ({ size }) => size === "small" && 0,
    pointerEvents: "initial",
    padding: 0,
    margin: [20, "auto"],
    minHeight: ({ size }) => size === "small" && `calc(100% - 20px)`,
  },
}));

export interface DialogComponentProps {
  open: boolean;
  className?: string;
  scrollClass?: string;
  onClose?: () => void;
}

export const Dialog: FC<DialogComponentProps> = (props) => {
  const { open, onClose = () => {}, className = "", scrollClass = "" } = props;
  const size = useScreen();

  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(!open);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, closing, size });

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

    function escapeListener(ev: KeyboardEvent) {
      if (ev.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", escapeListener);

    return () => {
      window.removeEventListener("keydown", escapeListener);
    };
  }, [open, closed, onClose]);

  if (closed) return null;

  return (
    <div className={classes.positioner}>
      <div onClick={onClose} className={classes.backdrop}></div>
      <div className={classes.scrollWrapper}>
        <div className={`${classes.contentWrapper} ${scrollClass}`.trim()}>
          <dialog open className={`${classes.content} ${className}`.trim()}>
            {props.children}
          </dialog>
        </div>
      </div>
    </div>
  );
};
