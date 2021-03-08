import { Meta, Story } from "@storybook/react";
import { Icon } from "../components/Icon";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { MiniScore } from "../components/MiniScore";

export default {
  component: List,
  title: "Components/List",
} as Meta;

interface ListStoryArgs {
  type: "contain" | "fill";
  items: number;
  button: boolean;
}

const Template: Story<ListStoryArgs> = (args) => (
  <List type={args.type}>
    {new Array(args.items).fill(0).map((_, i) => (
      <ListItem
        key={i}
        start={
          <MiniScore
            type="score"
            value={Math.floor(Math.random() * 4 * 10) / 10 + 1}
          />
        }
        subtitle={"Event " + (i + 1)}
        button={args.button}
        end={args.button && <Icon name="chevron_right" />}
      >
        Event Name
      </ListItem>
    ))}
  </List>
);

export const Fill = Template.bind({});
Fill.args = {
  items: 3,
  type: "fill",
  button: false,
};

export const Contain = Template.bind({});
Contain.args = {
  items: 3,
  type: "contain",
  button: false,
};
