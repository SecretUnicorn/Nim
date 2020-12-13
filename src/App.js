import React, { useEffect, useState } from "react"
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom';
import { Box, createMuiTheme, CssBaseline, Fab, makeStyles, SvgIcon, ThemeProvider, useTheme, Zoom } from "@material-ui/core";
import Cookies from "js-cookie"
import DarkModeSwitch from "DarkModeSwitch";
import Game from "components/Game";
import Settings from "components/Settings";


function App() {

  const [useDarktheme, setDarkTheme] = useState(true)

  const toggleDarkTheme = () => {
    const newValue = !useDarktheme
    setDarkTheme(newValue)
    let cookies = Cookies.get("norbert-settings")
    cookies = cookies ? JSON.parse(cookies) : {}
    cookies.prefereDarkmode = newValue
    Cookies.set("norbert-settings", JSON.stringify(cookies))
  }

  const MainTheme = React.useMemo(
    () =>
      createMuiTheme({
        palette: {
          mode: useDarktheme ? 'dark' : 'light',
        },
      }),
    [useDarktheme],
  );

  useEffect(() => {
    try{
      var settings = JSON.parse(Cookies.get("norbert-settings"))
    } catch {
      settings = {prefereDarkmode: true}
    }
    setDarkTheme(settings.prefereDarkmode)
  }, [])

  return (
    <div className="App" style={{minHeight: '100vh', minWidth: '100vw'}}>
    
    <ThemeProvider theme={MainTheme}>
      <CssBaseline/>

      <Router basename="norbert">
        <Route exact path="/">
          <Game/>
        </Route>
        <Route exact path="/settings">
          <Settings/>
        </Route>
        <DarkModeSwitch onClick={() => toggleDarkTheme()}/>
      </Router>

          
    </ThemeProvider>
    </div>
  );
}

export default App;