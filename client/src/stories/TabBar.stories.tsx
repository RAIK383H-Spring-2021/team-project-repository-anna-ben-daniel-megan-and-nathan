import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import { TabBar, TabBarComponentProps } from "../components/TabBar";

export default {
  title: "Components/TabBar",
  component: TabBar,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["primary", "secondary", "accent"],
      },
    },
  },
} as Meta;

const Template: Story<TabBarComponentProps> = (args) => (
  <TabBar {...args}>Button</TabBar>
);

export const Default = Template.bind({});
Default.args = {
  color: "primary",
  tabs: [
    { key: "created", label: "Created" },
    { key: "invited", label: "Invited" },
  ],
};
