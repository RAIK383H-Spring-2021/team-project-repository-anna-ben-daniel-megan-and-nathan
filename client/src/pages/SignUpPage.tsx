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
import { User } from "../User";
import { isEmail } from "../util/isEmail";

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
  error?: string;
}

const noErrState = () => ({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordVerify: "",
});

function validate(fn: string, ln: string, e: string, pw: string, pwv: string) {
  const base = noErrState();

  if (fn.length < 1) base["firstName"] = "Required.";
  if (ln.length < 1) base["lastName"] = "Required.";
  if (!isEmail(e)) base["email"] = "Must be an email.";
  if (e.length < 1) base["email"] = "Required.";
  if (pw.length < 6) base["password"] = "Must be at least 6 characters.";
  if (pw.length < 1) base["password"] = "Required.";
  if (pw !== pwv) base["passwordVerify"] = "Does not match password.";
  if (pwv.length < 1) base["passwordVerify"] = "Required.";

  return base;
}

const SignUpPage: FC = () => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });
  const history = useHistory();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVerify, setPasswordVerify] = useState("");

  const [errors, setErrors] = useState(noErrState());

  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();

    const err = validate(firstName, lastName, email, password, passwordVerify);

    if (Object.values(err).some((e) => e !== "")) {
      setErrors(err);
      return;
    }

    setIsLoading(true);

    const res = await API.post<SignUpResponse>("users", {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
    });

    setIsLoading(false);

    if (res.error) {
      // console.log(res.data.error);
      // if (res.data?.status) {
      // }
    } else {
      localStorage.removeItem("token");
      API.setToken(res.data.token);
      User.update(res.data.token);
      history.push("/dash");
    }
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
              error={errors.firstName}
            />
            <Input
              type="text"
              value={lastName}
              onChange={setLastName}
              className={classes.name}
              label="Last Name"
              error={errors.lastName}
            />
          </div>
          <Input
            value={email}
            onChange={setEmail}
            className={classes.input}
            type="email"
            label="Email"
            error={errors.email}
          />
          <Input
            value={password}
            onChange={setPassword}
            className={classes.input}
            type="password"
            label="Password"
            error={errors.password}
          />
          <Input
            value={passwordVerify}
            onChange={setPasswordVerify}
            className={classes.input}
            type="password"
            label="Confirm Password"
            error={errors.passwordVerify}
          />
          <div className={classes.buttonWrapper}>
            <Button onClick={(ev) => handleSubmit(ev)} color="accent">
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
