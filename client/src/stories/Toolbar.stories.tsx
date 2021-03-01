import React from "react";
import { Story, Meta } from "@storybook/react";
import { Toolbar, ToolbarComponentProps } from "../components/Toolbar";
import "../index.css";
import { Icon } from "../components/Icon";

export default {
  title: "Components/Toolbar",
  component: Toolbar,
} as Meta;

const Template: Story<ToolbarComponentProps> = (args) => (
  <div
    style={{
      width: 375,
      height: 812,
      border: "1px solid black",
      borderRadius: "8px",
      overflow: "hidden",
    }}
  >
    <Toolbar {...args} />
  </div>
);

export const Default = Template.bind({});
Default.args = {
  title: "Toolbar",
};

export const BackButton = Template.bind({});
BackButton.args = {
  start: <Icon name="arrow_back" />,
  title: "Go Back",
};
