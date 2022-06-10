import React from "react";
import { ThemeProvider } from "styled-components";
import { useAppSelector } from "./app/hooks";
import Navigation from "./components/Navigation";
import Scoreboard from "./components/Scoreboard";
import Stopwatch from "./components/Stopwatch";
import Welcome from "./components/Welcome";
import { GlobalStyles } from "./styles/globalStyles";

function App() {
  const { isStarted } = useAppSelector((store) => store.menu);
  const { theme } = useAppSelector((store) => store.scoreboard);

  if (isStarted) {
    return (
      <ThemeProvider theme={theme.theme}>
        <GlobalStyles />

        <div className="app text-center pt-[20vh] rela bg-[#c5603d] w-full h-full">
          <Scoreboard />
          <Navigation />
          <Stopwatch />
        </div>
      </ThemeProvider>
    );
  } else {
    return <Welcome />;
  }
}

export default App;
