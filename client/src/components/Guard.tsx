import { FC, ReactNode, useState } from "react";
import { Redirect, useHistory } from "react-router";

type Activation =
  | boolean
  | string
  | Promise<boolean>
  | Promise<string>
  | Promise<boolean | string>;

interface GuardComponentProps {
  canActivate: () => Activation;
  fallback: ReactNode;
}

export const Guard: FC<GuardComponentProps> = (props) => {
  const [activated, setActivated] = useState<Activation>(props.canActivate());
  const history = useHistory();

  if (activated === true) return <>{props.children}</>;
  else {
    if (activated === false) {
      history.goBack();
    } else if (typeof activated === "string") {
      return <Redirect to={activated} />;
    } else {
      activated.then((data: Activation) => setActivated(data));
    }
  }
  return <>{props.fallback}</>;
};
