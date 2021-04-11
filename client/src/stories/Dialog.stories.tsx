import { Meta, Story } from "@storybook/react";
import { Dialog, DialogComponentProps } from "../components/Dialog";
import { IconButton } from "../components/IconButton";
import { Toolbar } from "../components/Toolbar";

export default {
  title: "Components/Dialog",
  component: Dialog,
} as Meta;

const template: Story<DialogComponentProps> = (args) => (
  <Dialog {...args}>
    <Toolbar title="Hello, world!" end={<IconButton icon="close" />} />
    <div style={{ padding: 12 }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </p>
    </div>
  </Dialog>
);

export const Default = template.bind({});
Default.args = {
  open: true,
};
