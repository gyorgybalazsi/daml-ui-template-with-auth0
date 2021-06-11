import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/styles";
import { CssBaseline } from "@material-ui/core";

import Themes from "./themes";
import App from "./components/App";
import { UserProvider } from "./context/UserContext";

import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <Auth0Provider
    domain="dev-nqn0wejk.eu.auth0.com"
    clientId="BsqjwsJjtwuRFnGA0qRDZTclElGV7kPK"
    redirectUri={window.location.origin}
    audience= "https://daml.com/ledger-api"
  >
  <UserProvider>
    <ThemeProvider theme={Themes.default}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </UserProvider>
  </Auth0Provider>,
  document.getElementById("root"),
);
