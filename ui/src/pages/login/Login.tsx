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

const Login = (props : RouteComponentProps) => {
  var classes = useStyles();
  var userDispatch = useUserDispatch();
  var [isLoading, setIsLoading] = useState(false);
  var [error_1, setError] = useState(false);
/*   var [loginValue, setLoginValue] = useState("");
  var [passwordValue, setPasswordValue] = useState(""); */

  const {
    loginWithRedirect,
    getAccessTokenSilently,
    error
  } = useAuth0();

  const handleLoginClick = async () => {
    loginWithRedirect();
    if (!error){
      const token = await getAccessTokenSilently();
      console.log("token:" + token);
      const decoded = jwt.decode(token)
      console.log("type of decoded: " + typeof decoded);
      console.log("decoded: " + JSON.stringify(decoded))
      if (typeof decoded !== "object" || !decoded){
        throw new Error("Decoded token is not object")
      }
      const party = decoded["https://daml.com/ledger-api"].actAs[0];
      console.log(party);
      /* setLoginValue(party);
      setPasswordValue(token); */
      loginUser(
        userDispatch,
        party,
        token,
        props.history,
        setIsLoading,
        setError,
      )
    } else {
      throw new Error("Auth0 login error")
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
              <Fade in={error_1}>
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
