export interface IQuestionnaire {
  [key: string]: number;
}

export function getBase(): IQuestionnaire {
  return {
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    q10: 0,
    q11: 0,
    q12: 0,
  };
}

const components = [
  {
    type: "sentiment",
    question: `How comfortable are you with outdoor events?`,
  },
  {
    type: "sentiment",
    question: `How comfortable are you with indoor events?`,
  },
  {
    type: "sentiment",
    question: `How comfortable are you with remote events?`,
  },
  {
    type: "divider",
  },
  {
    type: "header",
    text: `When Meeting Indoors`,
  },
  {
    type: "slider",
    question: `What is the minimum distance you would like to keep between you and other people?`,
  },
  {
    type: "sentiment",
    question: "How important is it to you that everyone wears a mask?",
  },
  {
    type: "sentiment",
    question:
      "How comfortable are you with prepackaged, individually wrapped food?",
  },
  {
    type: "sentiment",
    question: "How comfortable are you with buffet-style food?",
  },
  {
    type: "select",
    question: "What is the maximum group size that you are comfortable with?",
    options: [
      {
        text: `1-5 people`,
        value: 5,
      },
    ],
  },
];

export interface QuestionnaireProps {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

console.log(components);
