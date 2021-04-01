import React, { FC } from "react";

export interface IconComponentProps {
  name: string;
  className?: string;
  size?: "small" | "medium" | "large" | "giant";
}

export const Icon: FC<IconComponentProps> = (props) => {
  const { className = "", size = "medium" } = props;
  const pixelSize =
    size === "medium" ? 24 : size === "large" ? 32 : size === "giant" ? 72 : 16;

  return (
    <span
      style={{ fontSize: pixelSize, lineHeight: "1em" }}
      className={`material-icons ${className}`}
    >
      {props.name}
    </span>
  );
};
