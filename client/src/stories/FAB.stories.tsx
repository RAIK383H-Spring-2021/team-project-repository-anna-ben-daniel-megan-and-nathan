import React from "react";
import { Story, Meta } from "@storybook/react";
import { FAB, FabComponentProps } from "../components/FAB";
import "../index.css";

export default {
  title: "Components/FAB",
  component: FAB,
} as Meta;

const Template: Story<FabComponentProps> = (args) => <FAB {...args} />;

export const Default = Template.bind({});
Default.args = {
  icon: "add",
};
