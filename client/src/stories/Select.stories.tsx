import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import { Select, SelectComponentProps } from "../components/Select";
import { useTheme } from "react-jss";
import { AppTheme } from "../theme";

export default {
  title: "Components/Select",
  component: Select,
  argTypes: {
    color: {
      control: {
        type: "select",
        options: ["primary", "secondary", "accent"],
      },
    },
  },
} as Meta;

const Template: Story<SelectComponentProps> = (args) => {
  const theme = useTheme<AppTheme>();
  return (
    <div
      style={{
        width: 375,
        height: 812,
        border: `1px solid ${theme.colors.divider.base.color}`,
        borderRadius: "8px",
        overflow: "hidden",
        ...theme.colors.background.base,
        padding: 20,
      }}
    >
      <Select {...args}>
        <option>Option 1</option>
        <option>Option 2</option>
        <option>Option 3</option>
      </Select>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: "Label",
};
