import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import { Button, ButtonComponentProps } from "../components/Button";

export default {
  title: "Components/Button",
  component: Button,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["primary", "secondary", "accent"],
      },
    },
  },
} as Meta;

const Template: Story<ButtonComponentProps> = (args) => (
  <Button {...args}>Button</Button>
);

export const Default = Template.bind({});
Default.args = {
  color: "primary",
  size: "medium",
};
