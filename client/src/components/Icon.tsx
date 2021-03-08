import React, { FC } from "react";

export interface IconComponentProps {
  name: string;
  className?: string;
}

export const Icon: FC<IconComponentProps> = (props) => {
  const { className = "" } = props;

  return <span className={`material-icons ${className}`}>{props.name}</span>;
};
