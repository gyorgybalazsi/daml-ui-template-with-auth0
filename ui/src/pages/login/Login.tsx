import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
//import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import { useUserDispatch, loginUser, loginDablUser } from "../../context/UserContext";
import { isLocalDev } from "../../config";
import useStyles from "./styles";
import logo from "./logo.svg";

import { useAuth0 } from "@auth0/auth0-react";
import * as jwt from 'jsonwebtoken' 
import { damlPartyKey, damlTokenKey } from "../../config";

const Login = (props : RouteComponentProps) => {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var [isLoading, setIsLoading] = useState(false);
  var [error, setError] = useState(false);
/*   var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState(""); */

  const {
    loginWithRedirect,
    getAccessTokenSilently
  } = useAuth0();

  // This function substitues the loginUser function,
  // see in UserContext.tsx
  const handleLoginClick = async () => {
    // This part substitutes the party and access token 
    // parameter input by acquiring the access token from Auth0
    // and extracting the party id from the access key.
    loginWithRedirect();
    const token = await getAccessTokenSilently();
    console.log("token:" + token);
    const decoded = jwt.decode(token)
    if (typeof decoded !== "object" || !decoded){
      throw new Error("Decoded token is not object")
    }
    const party = decoded["https://daml.com/ledger-api"].actAs[0];

    // This part is bascally the same as the body
    // of the loginUser function.

    setError(false);
    setIsLoading(true);

    if (!!party) {
      // This line is deleted, it originally served 
      // the purpose of creating an access token locally
      // when no access token was inputted on the UI
      //const token = userToken || createToken(party)
      localStorage.setItem(damlPartyKey, party);
      localStorage.setItem(damlTokenKey, token);

      userDispatch({ type: "LOGIN_SUCCESS", token, party });
      setError(false);
      setIsLoading(false);
      props.history.push("/app");
    } else {
      userDispatch({ type: "LOGIN_FAILURE" });
      setError(true);
      setIsLoading(false);
    }
  }

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>App Template</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <React.Fragment>
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              {!isLocalDev &&
                <>
                  <Button className={classes.dablLoginButton} variant="contained" color="primary" size="large" onClick={loginDablUser}>
                    Log in with DABL
                  </Button>
                  <Typography>
                    OR
                  </Typography>
                </>}
              {/* <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Username"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              /> */}
              <div className={classes.formButtons}>
                {isLoading ?
                  <CircularProgress size={26} className={classes.loginLoader} />
                : <Button
                    //disabled={loginValue.length === 0}
                    /* onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    } */
                    onClick = {() => handleLoginClick()}
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>}
              </div>
            </React.Fragment>
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
