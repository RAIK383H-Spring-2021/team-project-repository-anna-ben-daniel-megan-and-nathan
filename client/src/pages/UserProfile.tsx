import { FC, useEffect, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory } from "react-router-dom";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Content } from "../components/Content";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { Toolbar } from "../components/Toolbar";
import { FetchRequest, useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { AppTheme } from "../theme";
import { User } from "../User";

const useStyles = createUseStyles((theme: AppTheme) => ({
  mainWrapper: {
    marginTop: ({ large }) => (large ? 120 : 60),
    display: "grid",
    placeItems: "center",
  },
  nameInputWrapper: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: [0, 0, 12, 0],
    columnGap: 12,
  },
  emailInputWrapper: {
    margin: [12, 0, 12, 0],
  },
  sect: {
    maxWidth: 500,
    width: `calc(100% - 24px)`,
  },
}));

function getUser(id: number): FetchRequest {
  return {
    method: "GET",
    path: `users/${id}`,
  };
}

export const UserProfile: FC = () => {
  const screen = useScreen();

  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme, large: screen === "large" });
  const [response, loading] = useRequest<{ user: User }>(
    getUser,
    User.user?.id ?? -1
  );

  const [firstName, setFirstName] = useState(User.user?.first_name);
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(User.user?.email);

  const history = useHistory();

  useEffect(() => {
    if (response?.user) {
      setFirstName(response.user.first_name);
      setLastName(response.user.last_name);
      setEmail(response.user.email);
    }
  }, [response]);

  function goBack() {
    if (window.history.state?.state?.referrer) {
      if (window.history.state.state.referrer === "dashboard") {
        history.goBack();
        return;
      }
    }

    history.push("/dash");
  }

  return (
    <Content
      toolbar={
        <Toolbar
          start={<IconButton onClick={goBack} icon="arrow_back" />}
          title={loading ? "Loading..." : `${firstName}'s Account`}
          size={screen === "large" ? "large" : "normal"}
        />
      }
    >
      <div className={classes.mainWrapper}>
        <section className={classes.sect}>
          <h2>Profile</h2>
          <Card>
            <form>
              <div className={classes.nameInputWrapper}>
                <Input
                  label="First Name"
                  value={firstName}
                  onChange={setFirstName}
                />
                <Input
                  label="Last Name"
                  value={lastName}
                  onChange={setLastName}
                />
              </div>
              <div className={classes.emailInputWrapper}>
                <Input label="Email" value={email} onChange={setEmail} />
              </div>
              <Button>Save</Button>
            </form>
          </Card>
        </section>
        <section className={classes.sect}>
          <h2>Appearance</h2>
          <List type="contain">
            <ListItem>Use Dark Theme</ListItem>
          </List>
        </section>
      </div>
    </Content>
  );
};
