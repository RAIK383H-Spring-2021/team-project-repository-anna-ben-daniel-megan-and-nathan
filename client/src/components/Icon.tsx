import React, { FC } from "react";

export interface IconComponentProps {
  name: string;
}

export const Icon: FC<IconComponentProps> = (props) => {
  return <span className="material-icons">{props.name}</span>;
};
