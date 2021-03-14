import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";

const WIDTH = 250;
const STROKE = 16;

const useStyles = createUseStyles((theme: AppTheme) => ({
  box: {
    width: WIDTH,
    height: 200,
    display: "flex",
    position: "relative",
  },
  number: {
    fontFamily: "DM Sans",
    fontWeight: 700,
    fontSize: 60,
    letterSpacing: "0.04em",
    margin: "auto",
    zIndex: 0,
    color: theme.colors.background.base.color,
  },
  meterWrapper: {
    position: "absolute",
    width: WIDTH,
  },
  circle: {},
  meterBackground: {
    position: "absolute",
    backgroundColor: theme.colors.background.base.backgroundColor,
    width: WIDTH,
    height: WIDTH,
    top: 30 / 2,
    left: 30 / 2,
    borderRadius: 200,
  },
  label: {
    ...theme.typography.subheading,
    position: "absolute",
    margin: "auto",
    bottom: 36,
    width: "100%",
    textAlign: "center",
  },
}));

export interface ScoreComponentProps {
  val: number;
  max: number;
  type: "score" | "responses";
  label: string;
}

export const Score: FC<ScoreComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, type: props.type });

  const radius = WIDTH / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((circumference / 2) * props.val) / props.max;

  return (
    <div className={classes.box}>
      <div className={classes.meterWrapper}>
        <svg
          width="250"
          height="250"
          style={{ overflow: "visible", transform: "rotate(180deg)" }}
        >
          <defs>
            <linearGradient id="bright" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#4BB169" />
              <stop offset="50%" stop-color="#F7C44C" />
              <stop offset="100%" stop-color="#D62F43" />
            </linearGradient>
            <linearGradient id="muted" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(75, 177, 105, 0.33)" />
              <stop offset="50%" stop-color="rgba(247, 196, 76, 0.33)" />
              <stop offset="100%" stop-color="rgba(214, 47, 67, 0.33)" />
            </linearGradient>
          </defs>

          <circle
            cx={radius}
            cy={radius}
            r={radius}
            transform="rotate(180deg)"
            fill="transparent"
            stroke={
              props.type === "score" ? "url(#muted)" : "rgba(31, 87, 196, 0.25)"
            }
            stroke-width={STROKE}
            stroke-dasharray={`${circumference / 2}, ${circumference}`}
          />
          <circle
            cx={radius}
            cy={radius}
            r={radius}
            fill="transparent"
            transform="rotate(180deg)"
            stroke={props.type === "score" ? "url(#bright)" : "#1f57c4"}
            stroke-width={STROKE}
            stroke-dasharray={`${progress}, ${circumference}`}
          />
        </svg>
      </div>
      <div className={classes.number}>{props.val}</div>
      <div className={classes.label}>{props.label}</div>
    </div>
  );
};
