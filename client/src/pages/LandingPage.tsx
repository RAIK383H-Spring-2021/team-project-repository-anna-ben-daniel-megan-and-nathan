import { FC } from "react";
import { Helmet } from "react-helmet";
import { createUseStyles, useTheme } from "react-jss";
import { Link } from "react-router-dom";
import { Background } from "../components/Background";
import { Button } from "../components/Button";
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
    flexDirection: "column",
  },
  blue: {
    color: () =>
      theme.name === "light"
        ? theme.colors.primary.base.backgroundColor
        : theme.colors.primary.light?.backgroundColor,
  },
  details: {
    padding: "130px 180px",
    width: "calc(100% - 400px)",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    zIndex: 1,

    "@media (max-width: 1100px)": {
      padding: "80px 60px",
    },

    "@media (max-width: 830px)": {
      width: "100%",
      padding: 48,
      height: "min-content",
      position: "static",
    },
  },
  heading: {
    ...theme.typography.heading,
    fontSize: 32,
    lineHeight: "42px",
    marginBottom: 40,

    "@media (max-width: 830px)": {
      marginTop: 48,
      marginBottom: 12,
      fontSize: 24,
      lineHeight: "32px",
    },
  },
  description: {
    ...theme.typography.body,
    fontSize: 18,
    lineHeight: "28px",
    maxWidth: 600,
    marginBottom: 40,

    "@media (max-width: 830px)": {
      marginBottom: 60,
      fontSize: 14,
      lineHeight: "18px",
    },
  },
  loginRegisterWrapper: {
    "@media (max-width: 830px)": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  login: {
    ...theme.typography.button,
    marginLeft: 24,
    textDecoration: "none",

    "@media (max-width: 830px)": {
      marginLeft: 0,
      marginTop: 24,
    },
  },
  credits: {
    "@media (max-width: 830px)": {
      display: "none",
    },
  },
  spacer: {
    flex: "1 1 auto",
  },
  demo: {
    position: "absolute",
    right: -200,
    height: "100%",

    "@media (max-width: 1100px)": {
      right: -300,
    },

    "@media (max-width: 830px)": {
      width: "100%",
      left: 0,
      right: 0,
      position: "relative",
      display: "block",
      transform: "translateY(-100px)",
    },
  },
  backgroundWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  background: {
    height: 1000,
  },
  demoImageWrapper: {
    position: "absolute",
    top: 0,
    width: 1000,
    right: 0,
    height: "100%",
    display: "flex",

    "@media (max-width: 830px)": {
      width: "100%",
    },

    "@media (max-height: 600px)": {
      display: "none",
    },
  },
  demoImage: {
    height: 520,
    margin: "auto",
  },
}));

const LandingPage: FC = (props) => {
  const theme = useTheme<AppTheme>();
  const classes = useStyles({ theme });

  return (
    <div className={classes.content}>
      <Helmet title="Shindig"></Helmet>
      <div className={classes.details}>
        <div>
          <Logo type="full" />
        </div>
        <div className={classes.spacer}></div>
        <div>
          <h1 className={classes.heading}>
            Putting the <span className={classes.blue}>social</span> back into
            social distancing.
          </h1>
          <p className={classes.description}>
            <span className={classes.blue}>
              Shindig helps you navigate party planning in a pandemic.
            </span>{" "}
            Clearly visualize your invitees’ comfort levels and get
            automatically generated suggestions to throw the best party
            possible.
          </p>
        </div>
        <div className={classes.loginRegisterWrapper}>
          <Link to="/register">
            <Button color="accent">Sign Up</Button>
          </Link>
          <Link to="/login" className={classes.login}>
            Already have an account? Log In
          </Link>
        </div>
        <div className={classes.spacer}></div>
        <footer className={classes.credits}>
          <small>Friends and Family with Borders © 2021</small>
        </footer>
      </div>
      <div className={classes.demo}>
        <div className={classes.backgroundWrapper}>
          <Background className={classes.background} />
        </div>
        <div className={classes.demoImageWrapper}>
          <img
            className={classes.demoImage}
            src="/img/demo.png"
            alt="Events page screenshot."
          />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
