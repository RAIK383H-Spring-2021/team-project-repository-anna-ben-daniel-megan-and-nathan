import { FC } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles, useTheme } from "react-jss";
import { Link } from "react-router-dom";
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
}));

export const LogInPage: FC = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.content}>
      <Helmet title="Log In"></Helmet>
      <div className={classes.background}>
        <Background />
      </div>
      <main className={classes.card}>
        <div className={classes.logo}>
          <Logo type="full" />
        </div>
        <form className={classes.inputWrapper}>
          <Input className={classes.input} type="email" label="Email" />
          <Input className={classes.input} type="password" label="Password" />
        </form>
        <div className={classes.buttonWrapper}>
          <Button color="accent">Log In</Button>
        </div>
        <div className={classes.logInLinkWrapper}>
          <Link to="/register" className={classes.logInLink}>
            Don't have an account? Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
};
