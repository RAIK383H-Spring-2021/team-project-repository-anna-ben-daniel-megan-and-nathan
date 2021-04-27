import Switch from "@material/react-switch";
import { FC, FormEvent, useEffect, useState } from "react";
import { createUseStyles, useTheme } from "react-jss";
import { useHistory } from "react-router-dom";
import { API } from "../api";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Content } from "../components/Content";
import { Icon } from "../components/Icon";
import { IconButton } from "../components/IconButton";
import { Input } from "../components/Input";
import { List } from "../components/List";
import { ListItem } from "../components/ListItem";
import { Select } from "../components/Select";
import { Toolbar } from "../components/Toolbar";
import { FetchRequest, useRequest } from "../hooks/useRequest";
import { useScreen } from "../hooks/useScreen";
import { AppTheme, toggleTheme } from "../theme";
import { User } from "../User";
import { Questionnaire } from "./partials/Questionnaire";

const useStyles = createUseStyles((theme: AppTheme) => ({
  mainWrapper: {
    color: theme.colors.background.base.color,
    marginTop: ({ large }) => (large ? 120 : 60),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 60,
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
    margin: [12, 0],
  },
  buttonWrapper: {
    margin: [24, 0, 0, 0],
    display: "grid",
    placeItems: "center",
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
  const [privacy, setPrivacy] = useState("0");

  const [qOpen, setQOpen] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if (response?.user) {
      setFirstName(response.user.first_name);
      setLastName(response.user.last_name);
      setEmail(response.user.email);
      setPrivacy(response.user.privacy_level.toString());
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

  async function submitProfileUpdate(ev?: FormEvent) {
    if (ev) {
      ev.preventDefault();
    }

    const result = await API.put(`users/${User.user?.id}`, {
      email: email,
      first_name: firstName,
      last_name: lastName,
      privacy_level: Number(privacy),
    });

    if (result.error) {
      alert("There was a problem :(");
    }
  }

  function clearCache() {
    localStorage.removeItem("cache");
    window.location.reload();
  }

  function logOut() {
    localStorage.clear();
    history.push("/login");
  }

  return (
    <Content
      toolbar={
        <Toolbar
          background="filled"
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
            <form onSubmit={submitProfileUpdate}>
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
              <div className={classes.emailInputWrapper}>
                <Select
                  value={privacy}
                  onChange={setPrivacy}
                  label="Allow event organizers to see my scores."
                >
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </Select>
              </div>
              <div className={classes.buttonWrapper}>
                <Button color="accent">Save</Button>
              </div>
            </form>
          </Card>
        </section>
        <section className={classes.sect}>
          <h2>Options</h2>
          <List type="contain">
            <ListItem
              end={
                <Switch
                  nativeControlId="my-switch"
                  checked={theme.name === "dark"}
                  onChange={() => toggleTheme()}
                />
              }
            >
              <label htmlFor="my-switch">Use Dark Theme</label>
            </ListItem>
            <ListItem
              button
              onClick={() => setQOpen(true)}
              end={<Icon name="poll" />}
            >
              View Questionnaire
            </ListItem>
          </List>
        </section>
        <section className={classes.sect}>
          <h2>Data</h2>
          <List type="contain">
            <ListItem button onClick={clearCache} end={<Icon name="delete" />}>
              Clear Cache
            </ListItem>
            <ListItem button onClick={logOut} end={<Icon name="logout" />}>
              Log Out
            </ListItem>
          </List>
        </section>
      </div>
      <Questionnaire
        disabled
        onClose={() => setQOpen(false)}
        onSubmit={() => console.log("submit")}
        open={qOpen}
      />
    </Content>
  );
};
