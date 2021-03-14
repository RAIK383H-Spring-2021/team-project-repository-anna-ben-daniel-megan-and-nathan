import React, { FC } from "react";

export interface IconComponentProps {
  name: string;
  className?: string;
  size?: "small" | "medium" | "large";
}

export const Icon: FC<IconComponentProps> = (props) => {
  const { className = "", size = "medium" } = props;
  const pixelSize = size === "medium" ? 24 : size === "large" ? 32 : 16;

  return (
    <span
      style={{ fontSize: pixelSize }}
      className={`material-icons ${className}`}
    >
      {props.name}
    </span>
  );
};
