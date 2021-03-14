import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useRipple } from "../hooks/useRipple";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {
    ...theme.colors.background.base,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    zIndex: 1,
    padding: "8px 18px 28px 18px",
  },
  slider: {
    width: 150,
    maxWidth: "50%",
    backgroundColor: ({ color }) => theme.colors[color].base.backgroundColor,
    height: 37,
    position: "absolute",
    borderRadius: 50,
    transitionDuration: ({ prepared }) =>
      prepared ? theme.transitions.timing.normal : 0,
    transitionTimingFunction: theme.transitions.easing.default,
    transitionProperty: "left",
    left: "-100vw",
  },
}));

interface ITab {
  key: string;
  label: string;
}

export interface TabBarComponentProps {
  tabs: ITab[];
  color?: "primary" | "secondary" | "accent";
  onChange?: (key: string) => void;
  className?: string;
  current?: string;
}

export const TabBar: FC<TabBarComponentProps> = (props) => {
  const { color = "primary", className = "" } = props;

  const [prepared, setPrepared] = useState(false);

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, color, prepared });
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

    setTimeout(() => {
      setPrepared(true);
    }, 100);

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

  function changeActiveTab(btn: HTMLButtonElement, key: string) {
    props.onChange?.(key);
    setActive(btn);
  }

  if (wrapperRef.current && props.current) {
    const buttons = Array.from(
      wrapperRef.current.querySelectorAll<HTMLButtonElement>("button")
    );
    const idx = props.tabs.findIndex((tab) => tab.key === props.current);
    const b = buttons.find((button, i) => i === idx);
    if (b) {
      setActive(b);
    }
  }

  return (
    <div className={`${classes.wrapper} ${className}`} ref={wrapperRef}>
      <div className={classes.slider} ref={sliderRef}></div>
      {props.tabs.map((tab) => (
        <Tab
          key={tab.key}
          onClick={(ev) =>
            changeActiveTab(ev.target as HTMLButtonElement, tab.key)
          }
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
