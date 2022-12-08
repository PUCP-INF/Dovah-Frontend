import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import ContextProvider from "./componentes/Context";
import {HashRouter} from "react-router-dom";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc";
import { SnackbarProvider } from 'notistack';
import {StompSessionProvider} from "react-stomp-hooks";

dayjs.extend(utc);
dayjs.extend(timezone);

const root = ReactDOM.createRoot(document.getElementById("root"));

let url;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    url = "http://localhost:8081/chat/ws"
} else {
    url = "https://inf245g4i1.inf.pucp.edu.pe/chat/ws";
}


root.render(
  <React.StrictMode>
      <ContextProvider>
          <HashRouter>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <SnackbarProvider maxSnack={5} autoHideDuration={3000} anchorOrigin={{
                      horizontal: "right",
                      vertical: "bottom"
                  }}>
                      <StompSessionProvider url={url}>
                          <App />
                      </StompSessionProvider>
                  </SnackbarProvider>
              </LocalizationProvider>
          </HashRouter>
      </ContextProvider>
  </React.StrictMode>
);
