import { FC, MouseEvent, useEffect, useRef } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  slider: {
    width: 150,
    backgroundColor: ({ color }) => theme.colors[color].base.backgroundColor,
    height: 37,
    position: "absolute",
    borderRadius: 50,
    transitionDuration: theme.transitions.timing.normal,
    transitionTimingFunction: theme.transitions.easing.default,
  },
}));

interface ITab {
  key: string;
  label: string;
}

export interface TabBarComponentProps {
  tabs: ITab[];
  color?: "primary" | "secondary" | "accent";
}

export const TabBar: FC<TabBarComponentProps> = (props) => {
  const { color = "primary" } = props;

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color });
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;

    if (wrapper) {
      const tab = wrapper.querySelector<HTMLButtonElement>("button");
      setActive(tab);
    }

    function handleResize() {
      const active = wrapperRef.current?.querySelector<HTMLButtonElement>(
        "button[active]"
      );
      if (active) {
        setActive(active);
      }
    }

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function setActive(button: HTMLButtonElement | null) {
    const value = button?.offsetLeft.toString() + "px" ?? "";
    wrapperRef.current
      ?.querySelectorAll<HTMLButtonElement>("button")
      .forEach((btn) => btn.removeAttribute("active"));
    button?.setAttribute("active", "");
    sliderRef.current?.style.setProperty("left", value);
  }

  return (
    <div className={classes.wrapper} ref={wrapperRef}>
      <div className={classes.slider} ref={sliderRef}></div>
      {props.tabs.map((tab) => (
        <Tab
          key={tab.key}
          onClick={(ev) => setActive(ev.target as HTMLButtonElement)}
          color={color}
        >
          {tab.label}
        </Tab>
      ))}
    </div>
  );
};

const useTabStyles = createUseStyles((theme: AppTheme) => ({
  button: {
    ...theme.typography.button,
    ...theme.colors.background.base,
    color: theme.colors.background.base.color,
    backgroundColor: "transparent",
    border: "none",
    outline: "none",
    position: "relative",
    padding: "12px 24px",
    width: 150,
    overflow: "hidden",
    borderRadius: 50,
    transitionDuration: theme.transitions.timing.normal,
    transitionTimingFunction: theme.transitions.easing.default,
    cursor: "pointer",

    "&[active]": {
      color: ({ color }) => theme.colors[color].base.color,
    },
  },
}));

interface TabProps {
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  key: string;
  color: string;
}

const Tab: FC<TabProps> = (props) => {
  const { color } = props;
  const theme = useTheme<AppTheme>();

  const classes = useTabStyles({ theme, color });
  const rippleRef = useRef(null);

  useRipple(rippleRef, theme.colors[color].base.backgroundColor);

  return (
    <button className={classes.button} ref={rippleRef} onClick={props.onClick}>
      {props.children}
    </button>
  );
};
