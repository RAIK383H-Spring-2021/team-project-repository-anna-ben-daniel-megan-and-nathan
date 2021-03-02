import React from "react";
import { Story, Meta } from "@storybook/react";
import { Toolbar, ToolbarComponentProps } from "../components/Toolbar";
import "../index.css";
import { IconButton } from "../components/IconButton";
import { Button } from "../components/Button";

export default {
  title: "Components/Toolbar",
  component: Toolbar,
  argTypes: {
    start: {
      table: {
        disable: true,
      },
    },
    end: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const Template: Story<ToolbarComponentProps> = (args) => {
  return <Toolbar {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  title: "Toolbar",
};

export const IconStart = Template.bind({});
IconStart.args = {
  title: "Create Event",
  start: <IconButton icon="arrow_back" />,
};

export const IconStartEnd = Template.bind({});
IconStartEnd.args = {
  title: "Alicia's Birthday Bash",
  start: <IconButton icon="arrow_back" />,
  end: <IconButton icon="more_vert" />,
};

export const IconEnd = Template.bind({});
IconEnd.args = {
  title: "Dashboard",
  end: <IconButton icon="account_circle" />,
};

export const ButtonAndIcon = Template.bind({});
ButtonAndIcon.args = {
  title: "Questionnaire",
  start: <IconButton icon="close" />,
  end: <Button color="accent">Submit</Button>,
};
