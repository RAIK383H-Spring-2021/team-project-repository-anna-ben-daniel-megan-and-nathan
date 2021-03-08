import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import { Stepper, StepperComponentProps } from "../components/Stepper";

export default {
    title: "Components/Stepper",
    component: Stepper,
} as Meta;

const Template: Story<StepperComponentProps> = (args) => (
    <Stepper {...args} />
);

export const Default = Template.bind({});
Default.args = {
    disabled: [false, true, true],
    onChange: () => { },
};
