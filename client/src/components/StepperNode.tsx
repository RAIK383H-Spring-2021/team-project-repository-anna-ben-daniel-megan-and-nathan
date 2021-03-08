import { FC, MouseEvent } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";
import { useScreen } from "../hooks/useScreen";
import { Icon } from "./Icon";

const useStyles = createUseStyles((theme: AppTheme) => ({
    wrapper: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "fit-content",
    },
    button: {
        padding: 12,
        height: 48,
        width: 48,
        borderRadius: 24,
        backgroundColor: ({ active }) => active ? theme.colors.primary.base.backgroundColor : theme.colors.background.base.backgroundColor,
        border: "1px solid",
        borderColor: ({ active, disabled }) => {
            if (active) {
                return theme.colors.primary.base.backgroundColor;
            } else if (disabled) {
                return theme.colors.divider.base.backgroundColor;
            } else {
                return theme.colors.primary.base.backgroundColor;
            }
        },
        cursor: ({ disabled }) => disabled ? "default" : "pointer",
        "&:focus": {
            outline: "none",
        }
    },
    buttonIcon: {
        height: 24,
        width: 24,
        color: ({ active, disabled }) => {
            if (active) {
                return theme.colors.primary.base.color;
            } else if (disabled) {
                return theme.colors.divider.base.backgroundColor;
            } else {
                return theme.colors.primary.base.backgroundColor;
            }
        },
    },
    label: {
        ...theme.typography.button,
        color: ({ active }) => active ? theme.colors.primary.base.backgroundColor : theme.colors.background.base.backgroundColor,
        display: ({ size }) => size === "large" ? "default" : "none",
        marginRight: 24,
    },
}));

export interface StepperNodeComponentProps {
    label: string,
    icon: string,
    active: boolean,
    disabled?: boolean,
    onClick?: (ev: MouseEvent<HTMLButtonElement>) => void;
}

export const StepperNode: FC<StepperNodeComponentProps> = (props) => {
    const size = useScreen();
    const theme = useTheme<AppTheme>();
    const classes = useStyles({ theme, size, ...props });

    return (
        <div className={classes.wrapper}>
            <label className={classes.label}>{props.label}</label>
            <button className={classes.button} onClick={props.onClick} disabled={props.disabled}>
                <Icon name={props.icon} className={classes.buttonIcon} />
            </button>
        </div>
    );
};