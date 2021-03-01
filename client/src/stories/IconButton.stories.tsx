import { Meta, Story } from "@storybook/react";
import { IconButton, IconButtonComponentProps } from "../components/IconButton";

export default {
  title: "Components/Icon Button",
  component: IconButton,
} as Meta;

const template: Story<IconButtonComponentProps> = (args) => (
  <IconButton {...args} />
);

export const Default = template.bind({});
Default.args = {
  icon: "arrow_back",
};
