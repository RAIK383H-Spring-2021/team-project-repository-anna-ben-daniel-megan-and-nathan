import { FC } from "react";

export interface BackgroundComponentProps {
  className?: string;
}

export const Background: FC<BackgroundComponentProps> = (props) => {
  return (
    <img
      className={props.className}
      src="/img/background.svg"
      alt=""
      role="presentation"
    />
  );
};
