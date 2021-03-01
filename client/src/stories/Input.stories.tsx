import { Meta, Story } from "@storybook/react";
import { useTheme } from "react-jss";
import { Input, InputComponentProps } from "../components/Input";
import { AppTheme } from "../theme";

export default {
  title: "Components/Input",
  component: Input,
} as Meta;

const Template: Story<InputComponentProps> = (args) => {
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
      <Input {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  type: "text",
  label: "Label",
  caption: "Caption",
  maxLength: 250,
  placeholder: "Placeholder Text...",
};
