import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import {
  SentimentPicker,
  SentimentPickerComponentProps,
} from "../components/SentimentPicker";

export default {
  title: "Components/SentimentPicker",
  component: SentimentPicker,
} as Meta;

const Template: Story<SentimentPickerComponentProps> = (args) => (
  <SentimentPicker {...args} />
);

export const Default = Template.bind({});
Default.args = {
  onChange: () => {},
};
