import { Meta, Story } from "@storybook/react";
import { PropsWithChildren } from "react";
import { Button } from "../components/Button";
import { ListItem, ListItemComponentProps } from "../components/ListItem";
import { MiniScore } from "../components/MiniScore";

export default {
  component: ListItem,
  title: "Components/List Item",
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
    children: {
      table: {
        disable: true,
      },
    },
  },
} as Meta;

const Template: Story<PropsWithChildren<ListItemComponentProps>> = (args) => (
  <ListItem {...args} />
);

export const HighScore = Template.bind({});
HighScore.args = {
  children: "High Score",
  start: <MiniScore value={4.5} />,
  end: <Button color="accent">Button</Button>,
  subtitle: "Hi",
};

export const MidScore = Template.bind({});
MidScore.args = {
  children: "Medium Score",
  start: <MiniScore value={3.3} />,
  end: <Button color="accent">Button</Button>,
  subtitle: "Mid",
};

export const LowScore = Template.bind({});
LowScore.args = {
  children: "Low Score",
  start: <MiniScore value={1.7} />,
  end: <Button color="accent">Button</Button>,
  subtitle: "Lo",
};
