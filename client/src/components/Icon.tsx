import React, { FC } from "react";

export interface IconComponentProps {
  name: string;
  className?: string;
}

export const Icon: FC<IconComponentProps> = (props) => {
  return (
    <span className={`material-icons ${props.className}`}>{props.name}</span>
  );
};
