import { FC, FormEvent, useState } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles, useTheme } from "react-jss";
import { Link, useHistory } from "react-router-dom";
import { API } from "../api";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
import { MutativeRequest, useRequest } from "../hooks/useRequest";
import { AppTheme } from "../theme";

const useStyles = createUseStyles((theme: AppTheme) => ({
  content: {
    ...theme.colors.background.base,
    height: "100%",
    width: "100%",
    overflow: "hidden",
    position: "absolute",
    display: "flex",
  },
  background: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  card: {
    ...theme.colors.background.base,
    width: 475,
    margin: "auto",
    padding: 48,
    zIndex: 1,
    borderRadius: 12,
    maxHeight: "100%",
    overflowY: "auto",

    "@media (max-width: 710px)": {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      padding: 32,
    },
  },
  input: {
    margin: "12px 0",
  },
  nameWrapper: {
    display: "grid",
    gridTemplateColumns: "calc(50% - 7px) calc(50% - 7px)",
    columnGap: 14,
    margin: "12px 0",
  },
  name: {
    flex: "1 1 auto",
    alignSelf: "auto",
  },
  logo: {
    marginBottom: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logInLinkWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
  },
  logInLink: {
    ...theme.typography.button,
    textDecoration: "none",
  },
  buttonWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 36,
  },
  logoLink: {
    textDecoration: "none",
    margin: "none",
  },
}));

interface SignUpResponse {
  token: string;
}

const signUp = (
  first_name: string,
  last_name: string,
  email: string,
  password: string
) =>
  ({
    method: "POST",
    path: "users",
    body: {
      first_name,
      last_name,
      email,
      password,
      privacy_level: 1,
    },
    onComplete: (response: SignUpResponse) =>
      (response as any)?.token && API.setToken((response as any).token),
  } as MutativeRequest);

const SignUpPage: FC = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const [response, isLoading, makeRequest] = useRequest<SignUpResponse>(signUp);

  if (response?.token) {
    history.push("/dash");
  }

  function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    makeRequest(firstName, lastName, email, password);
  }

  return (
    <div className={classes.content}>
      <Helmet title="Sign Up"></Helmet>
      <div className={classes.background}>
        <Background />
      </div>
      <main className={classes.card}>
        <div className={classes.logo}>
          <Link to="/" className={classes.logoLink}>
            <Logo type="full" />
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={classes.nameWrapper}>
            <Input
              type="text"
              value={firstName}
              onChange={setFirstName}
              className={classes.name}
              label="First Name"
            />
            <Input
              type="text"
              value={lastName}
              onChange={setLastName}
              className={classes.name}
              label="Last Name"
            />
          </div>
          <Input
            value={email}
            onChange={setEmail}
            className={classes.input}
            type="email"
            label="Email"
          />
          <Input
            value={password}
            onChange={setPassword}
            className={classes.input}
            type="password"
            label="Password"
          />
          <Input
            value={passwordVerify}
            onChange={setPasswordVerify}
            className={classes.input}
            type="password"
            label="Confirm Password"
          />
          <div className={classes.buttonWrapper}>
            <Button
              onClick={() => makeRequest(firstName, lastName, email, password)}
              color="accent"
            >
              {isLoading ? "Loading..." : "Sign Up"}
            </Button>
          </div>
        </form>
        <div className={classes.logInLinkWrapper}>
          <Link to="/login" className={classes.logInLink}>
            Already have an account? Log In
          </Link>
        </div>
      </main>
    </div>
  );
};

export default SignUpPage;
