import { FC, useState } from "react";
import { createUseStyles } from "react-jss";
import { useTheme } from "theming";
import { Button } from "../../components/Button";
import { Dialog } from "../../components/Dialog";
import { Divider } from "../../components/Divider";
import { IconButton } from "../../components/IconButton";
import { Select } from "../../components/Select";
import { SentimentPicker } from "../../components/SentimentPicker";
import { Slider } from "../../components/Slider";
import { Toolbar } from "../../components/Toolbar";
import { AppTheme } from "../../theme";

export interface IQuestionnaire {
  [key: string]: number;
}

export function getBase(): IQuestionnaire {
  return {
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 6,
    q5: 6,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 5,
    q10: 6,
    q11: 6,
    q12: 0,
    q13: 0,
    q14: 0,
    q15: 5,
  };
}

interface ISentiment {
  type: "sentiment";
  question: string;
  id: number;
}

interface ISlider {
  type: "slider";
  question: string;
  id: number;
}

interface IDivider {
  type: "divider";
}

interface IHeader {
  type: "header";
  text: string;
}

interface ISelectOption {
  text: string;
  value: number;
}

interface ISelect {
  type: "select";
  question: string;
  options: ISelectOption[];
  id: number;
}

type QuestionnaireComponent =
  | ISelect
  | IHeader
  | IDivider
  | ISlider
  | ISentiment;

const components: QuestionnaireComponent[] = [
  {
    id: 1,
    type: "sentiment",
    question: `How comfortable are you with outdoor events?`,
  },
  {
    id: 2,
    type: "sentiment",
    question: `How comfortable are you with indoor events?`,
  },
  {
    id: 3,
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
  ...getSubQuestions(4),
  {
    type: "divider",
  },
  {
    type: "header",
    text: `When Meeting Outdoors`,
  },
  ...getSubQuestions(10),
];

function getSubQuestions(start: number): QuestionnaireComponent[] {
  return [
    {
      id: start,
      type: "slider",
      question: `What is the minimum distance you would like to keep between you and other people when wearing masks?`,
    },
    {
      id: start + 1,
      type: "slider",
      question: `What is the minimum distance you would like to keep between you and other people when not wearing masks?`,
    },
    {
      id: start + 2,
      type: "sentiment",
      question: "How important is it to you that everyone wears a mask?",
    },
    {
      id: start + 3,
      type: "sentiment",
      question:
        "How comfortable are you with prepackaged, individually wrapped food?",
    },
    {
      id: start + 4,
      type: "sentiment",
      question: "How comfortable are you with buffet-style food?",
    },
    {
      id: start + 5,
      type: "select",
      question: "What is the maximum group size that you are comfortable with?",
      options: [
        {
          text: `1-5 people`,
          value: 5,
        },
        {
          text: `5-10 people`,
          value: 10,
        },
        {
          text: `10-25 people`,
          value: 25,
        },
        {
          text: `25-50 people`,
          value: 50,
        },
        {
          text: `50-100 people`,
          value: 100,
        },
        {
          text: `Any number of people`,
          value: -1,
        },
      ],
    },
  ];
}

export interface QuestionnaireProps {
  open: boolean;
  onSubmit: (q: IQuestionnaire) => void;
  onClose: () => void;
}

const useStyles = createUseStyles((theme) => ({
  toolbar: {
    position: "sticky",
    top: "-2px",
  },
  body: {
    // empty for now
  },
  question: {
    margin: "32px 32px",
  },
}));

const q = getBase();

export const Questionnaire: FC<QuestionnaireProps> = (props) => {
  const { open, onSubmit, onClose } = props;

  const [canSubmit, setCanSubmit] = useState(
    Object.values(q).every((val) => val !== 0)
  );

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  function updateQ(num: number, val: number) {
    q[`q${num}`] = val;
    if (Object.values(q).every((val) => val !== 0)) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <Toolbar
        className={classes.toolbar}
        background="filled"
        title="Questionnaire"
        start={<IconButton onClick={onClose} icon="close" />}
        end={
          <Button
            disabled={!canSubmit}
            onClick={() => onSubmit(q)}
            color="accent"
          >
            Submit
          </Button>
        }
      />
      <div className={classes.body}>
        {components.map((c, i) => (
          <QuestionnairePart
            q={q}
            comp={c}
            key={i}
            update={(id, val) => updateQ(id, val)}
          />
        ))}
      </div>
    </Dialog>
  );
};

interface QuestionnaireComponentProps {
  q: IQuestionnaire;
  comp: QuestionnaireComponent;
  update: (id: number, value: number) => void;
}

const QuestionnairePart: FC<QuestionnaireComponentProps> = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  const [val, setVal] = useState(
    "id" in props.comp ? valueAt(props.comp.id) : 0
  );

  const update = (id: number, val: number) => {
    setVal(val);
    props.update(id, val);
  };

  function valueAt(num: number) {
    return q[`q${num}`];
  }

  const c = props.comp;

  switch (c.type) {
    case "divider":
      return <Divider color="divider" />;
    case "header":
      return <h3 className={classes.question}>{c.text}</h3>;
    case "select":
      return (
        <div className={classes.question}>
          <Select
            label={c.question}
            onChange={(val) => update(c.id, Number(val))}
          >
            {c.options.map((o, ii) => (
              <option key={ii} value={o.value}>
                {o.text}
              </option>
            ))}
          </Select>
        </div>
      );
    case "sentiment":
      return (
        <div className={classes.question}>
          <SentimentPicker
            label={c.question}
            value={valueAt(c.id)}
            onChange={(val) => update(c.id, val)}
          />
        </div>
      );
    case "slider":
      return (
        <div className={classes.question}>
          <Slider
            value={val.toString()}
            onChange={(val) => update(c.id, Number(val))}
            label={c.question}
            min={1}
            max={12}
            units={val === 1 ? "foot" : "feet"}
          />
        </div>
      );
    default:
      return <span>Guh</span>;
  }
};
