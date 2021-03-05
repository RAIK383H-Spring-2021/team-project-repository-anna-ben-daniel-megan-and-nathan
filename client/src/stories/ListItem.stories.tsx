import { Meta, Story } from "@storybook/react";
import { PropsWithChildren } from "react";
import { ListItem, ListItemComponentProps } from "../components/ListItem";

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

export const Default = Template.bind({});
Default.args = {
  children: "Hello, world",
};
