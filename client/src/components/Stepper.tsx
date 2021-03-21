import { FC, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { AppTheme } from "../theme";
import { useScreen } from "../hooks/useScreen";
import { StepperNode } from "./StepperNode";

const useStyles = createUseStyles((theme: AppTheme) => ({
  wrapper: ({ size }) => {
    if (size === "large") {
      return {
        display: "flex",
        flexDirection: "column",
        height: "60vh",
        width: "fit-content",
        alignItems: "flex-end",
      };
    } else {
      return {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "fit-content",
        margin: "0 48px",
      };
    }
  },
  stepperLine: ({ size }) => {
    if (size === "large") {
      return {
        flexGrow: 1,
        width: 1,
        marginRight: 24,
      };
    } else {
      return {
        flexGrow: 1,
        height: 1,
      };
    }
  },
  disabled: {
    backgroundColor: theme.colors.divider.base.backgroundColor,
  },
  primary: {
    backgroundColor: theme.colors.primary.base.backgroundColor,
  },
}));

export interface StepperComponentProps {
  className?: string;
  disabled: boolean[];
  onChange: (node: number) => void;
}

export const Stepper: FC<StepperComponentProps> = (props) => {
  const [activeNode, setActiveNode] = useState(0);
  const size = useScreen();
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, activeNode, size, ...props });

  const changeStep = (node: number) => {
    setActiveNode(node);
    props.onChange(node);
  };

  return (
    <div className={`${classes.wrapper} ${props.className}`}>
      <StepperNode
        icon="edit"
        label="Set Event Details"
        active={activeNode === 0}
        disabled={props.disabled[0]}
        onClick={() => changeStep(0)}
      />
      <div
        className={`${classes.stepperLine} ${props.disabled[1] ? classes.disabled : classes.primary
          }`}
      />
      <StepperNode
        icon="group_add"
        label="Add Participants"
        active={activeNode === 1}
        disabled={props.disabled[1]}
        onClick={() => changeStep(1)}
      />
      <div
        className={`${classes.stepperLine} ${props.disabled[2] ? classes.disabled : classes.primary
          }`}
      />
      <StepperNode
        icon="send"
        label="Send Invites"
        active={activeNode === 2}
        disabled={props.disabled[2]}
        onClick={() => changeStep(2)}
      />
    </div>
  );
};
