import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const WIDTH = 250;
const HEIGHT = 250;

const useStyles = createUseStyles((theme: AppTheme) => ({
  box: {
    width: 255,
    height: 166,
    display: "flex",
  },
  number: {
    fontFamily: "DM Sans",
    fontWeight: 700,
    fontSize: 60,
    letterSpacing: "0.04em",
    margin: "auto",
    zIndex: 99,
  },
  meterWrapper: {
    position: "absolute",
  },
  meterOuter: {
    position: "relative",
    display: "inline-block",
    overflow: "hidden",
    width: 255,
    height: 255 / 2,
  },
  meterInner: {
    position: "relative",
    width: 255,
    height: 255,
    background: ({ type }) =>
      type === "responses"
        ? "rgba(31, 87, 196, 0.25)"
        : "conic-gradient(from -90deg at 50% 50%, rgba(214, 47, 67, 0.33) 0deg, rgba(247, 196, 76, 0.33) 89.37deg, rgba(75, 177, 105, 0.33) 179.37deg, rgba(214, 47, 67, 0.33) 360deg)",
    borderRadius: "50%",
    overflow: "hidden",
  },
  meterSegment: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100vw",
    height: "100vh",
    transformOrigin: "0 0",
    transitionDuration: theme.transitions.timing.short,
    transitionTimingFunction: "linear",
  },
  meterBackground: {
    position: "absolute",
    backgroundColor: theme.colors.background.base.backgroundColor,
    width: 225,
    height: 225,
    top: 30 / 2,
    left: 30 / 2,
    borderRadius: 200,
  },
}));

export interface ScoreComponentProps {
  val: number;
  max: number;
  type: "score" | "responses";
}

export const Score: FC<ScoreComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, type: props.type });

  const percent = props.val / props.max;
  const pctOf180 = 180 - 180 * percent;

  const s1 = Math.min(90, Math.max(0, pctOf180 - 90));
  const p = Math.max(0, percent * 2 - 1);
  const x = p * (Math.PI / 2);
  const s2X = Math.sin(x + Math.PI / 2) * 100;
  const s2Y = -Math.cos(x + Math.PI / 2) * 100;

  const path = `polygon(0 100%, ${s2X}% ${s2Y}%, 0 0)`;
  console.log(path);

  return (
    <div>
      <div className={classes.box}>
        <div className={classes.meterWrapper}>
          <div className={classes.meterOuter}>
            <div className={classes.meterInner}>
              <div
                className={classes.meterSegment}
                style={{
                  transform: `rotate(180deg) skew(${s1}deg)`,
                  background:
                    props.type === "responses"
                      ? "#1F57C4"
                      : `conic-gradient(from 90deg at 0 0, #D62F43 0deg, #F7C44C ${
                          90 + s1
                        }deg, #4BB169 ${180 + s1}deg, #D62F43 ${360 + s1}deg)`,
                }}
              ></div>
              <div
                className={classes.meterSegment}
                style={{
                  transform: `rotate(270deg)`,
                  background:
                    props.type === "responses"
                      ? "#1F57C4"
                      : `conic-gradient(from 90deg at 0 0, #F7C44C 0deg, #4BB169 90deg`,
                  clipPath: path,
                }}
              ></div>
              <div className={classes.meterBackground}></div>
            </div>
          </div>
        </div>
        <div className={classes.number}>{props.val}</div>
      </div>
      <img
        height="400"
        style={{ clipPath: path }}
        src="https://images.unsplash.com/photo-1488654715439-fbf461f0eb8d?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
      ></img>
    </div>
  );
};
