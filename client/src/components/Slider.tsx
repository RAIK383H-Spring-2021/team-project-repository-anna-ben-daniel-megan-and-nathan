import { FC } from "react";
import { createUseStyles, useTheme } from "react-jss";
import ReactSlider from "rc-slider";
import "rc-slider/assets/index.css";
import { AppTheme } from "../theme";
import { Input } from "./Input";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: {},
  label: {
    ...theme.typography.preTitle,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
  },
  input: {
    position: "relative",
    width: 90,
    "&:after": {
      content: ({ units }) => `"${units}"`,
      ...theme.typography.body,
      color: theme.colors.background.light?.color,
      position: "absolute",
      right: 1,
      top: 11,
      padding: "12px 18px 12px 6px",
      borderRadius: 4,
      backgroundColor: theme.colors.background.base.backgroundColor,
    },
  },
  sliderWrapper: {
    flexGrow: 1,
    marginLeft: 24,
    height: "fit-content",
  },
  sliderLabels: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
    color: theme.colors.background.light?.color,
  },
}));

export interface SliderComponentProps {
  label?: string;
  placeholder?: string;
  caption?: string;
  maxLength?: number;
  disabled?: boolean;
  value?: string;
  min?: number;
  max?: number;
  onChange: (value: string) => void;
  className?: string;
  units?: string;
}

export const Slider: FC<SliderComponentProps> = (props) => {
  const {
    label,
    placeholder,
    caption,
    maxLength,
    disabled,
    value,
    min,
    max,
    onChange,
    className,
    units,
  } = props;
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, units });

  return (
    <div className={classes.wrapper}>
      <label className={classes.label}>{label}</label>
      <div className={classes.inputGroup}>
        <Input
          type="number"
          placeholder={placeholder}
          caption={caption}
          maxLength={maxLength}
          disabled={disabled}
          value={value}
          onChange={(value) => onChange(value)}
          className={`${classes.input} ${className}`}
          min={min}
          max={max}
        />
        <div className={classes.sliderWrapper}>
          <ReactSlider
            disabled={disabled}
            value={parseInt(value ?? "")}
            onChange={(value) => onChange(value.toString())}
            max={max}
            min={min}
            railStyle={{
              backgroundColor: theme.colors.divider.base.backgroundColor,
              height: 2,
            }}
            trackStyle={{
              backgroundColor: theme.colors.primary.base.backgroundColor,
              height: 2,
            }}
            handleStyle={{
              backgroundColor: theme.colors.primary.base.backgroundColor,
              borderColor: theme.colors.primary.base.backgroundColor,
              height: 16,
              width: 16,
              marginTop: -7,
            }}
          />
          <div className={classes.sliderLabels}>
            <div>{min}</div>
            <div>{max}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
