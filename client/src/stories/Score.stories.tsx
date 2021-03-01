import React from "react";
import { Story, Meta } from "@storybook/react";
import "../index.css";
import { Score, ScoreComponentProps } from "../components/Score";

export default {
  title: "Components/Score",
  component: Score,
} as Meta;

const Template: Story<ScoreComponentProps> = (args) => (
  <Score {...args}>Button</Score>
);

export const ResponsesMin = Template.bind({});
ResponsesMin.args = {
  val: 0,
  max: 10,
  type: "responses",
};

export const ResponsesMid = Template.bind({});
ResponsesMid.args = {
  val: 5,
  max: 10,
  type: "responses",
};

export const ResponsesMax = Template.bind({});
ResponsesMax.args = {
  val: 10,
  max: 10,
  type: "responses",
};

export const ScoreMin = Template.bind({});
ScoreMin.args = {
  val: 0,
  max: 10,
  type: "score",
};

export const ScoreMid = Template.bind({});
ScoreMid.args = {
  val: 5,
  max: 10,
  type: "score",
};

export const ScoreMax = Template.bind({});
ScoreMax.args = {
  val: 10,
  max: 10,
  type: "score",
};
