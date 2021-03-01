import { Meta, Story } from "@storybook/react";
import { Input, InputComponentProps } from "../components/Input";

export default {
  title: "Components/Input",
  component: Input,
} as Meta;

const template: Story<InputComponentProps> = (args) => (
  <div
    style={{
      width: 375,
      height: 812,
      border: "1px solid black",
      borderRadius: "8px",
      overflow: "hidden",
      padding: 20,
    }}
  >
    <Input {...args} />
  </div>
);

export const Default = template.bind({});
Default.args = {
  type: "text",
  label: "Label",
  caption: "Caption",
  maxLength: 250,
  placeholder: "Placeholder Text...",
};
