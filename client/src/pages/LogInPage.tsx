import { FC, FormEvent, useState } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles, useTheme } from "react-jss";
import { Link, useHistory } from "react-router-dom";
import { API } from "../api";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Logo } from "../components/Logo";
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
  inputWrapper: {
    // margin: "12px 28px",
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

interface LoginResponse {
  token?: string;
  status?: string;
}

const LogInPage: FC = () => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({ user: false, password: false });

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();

    setIsLoading(true);

    const res = await API.post<LoginResponse>("users/login", {
      email,
      password,
    });

    setIsLoading(false);

    if (res.error) {
      if (res.data?.status === "user not found") {
        setErrors({ user: true, password: false });
      } else {
        setErrors({ user: false, password: true });
      }
    } else {
      history.push("/dash");
    }
  }

  return (
    <div className={classes.content}>
      <Helmet title="Log In"></Helmet>
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
          <div className={classes.inputWrapper}>
            <Input
              className={classes.input}
              value={email}
              onChange={setEmail}
              type="email"
              label="Email"
              error={errors.user ? "User not found." : undefined}
            />
            <Input
              className={classes.input}
              value={password}
              onChange={setPassword}
              type="password"
              label="Password"
              error={errors.password ? "Incorrect password." : undefined}
            />
          </div>
          <div className={classes.buttonWrapper}>
            <Button color="accent" onClick={(ev) => handleSubmit(ev)}>
              {isLoading ? "Loading..." : "Log In"}
            </Button>
          </div>
        </form>
        <div className={classes.logInLinkWrapper}>
          <Link to="/register" className={classes.logInLink}>
            Don't have an account? Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
};

export default LogInPage;
