import React from "react";
import { ThemeProvider } from "styled-components";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Scoreboard from "./components/Scoreboard";
import Stopwatch from "./components/Stopwatch";
import Welcome from "./components/Welcome";
import { backToMenu } from "./features/menu/menuSlice";
import { redo, resetMatch, undo } from "./features/scoreboard/scoreboardSlice";
import { GlobalStyles } from "./styles/globalStyles";

function App() {
  const dispatch = useAppDispatch();
  const { isStarted } = useAppSelector((store) => store.menu);
  const { theme } = useAppSelector((store) => store.scoreboard);

  if (isStarted) {
    return (
      <ThemeProvider theme={theme.theme}>
        <GlobalStyles />

        <div className="app text-center  pt-32 bg-[#c5603d] w-full h-full">
          <Scoreboard />
          <div>
            <button
              onClick={() => dispatch(backToMenu())}
              className="bg-cyan-800 rounded-md px-8 py-4 text-3xl shadow-md text-white mt-8"
            >
              Menu
            </button>
            <button
              onClick={() => dispatch(undo())}
              className="bg-teal-600 rounded-md px-8 py-4 text-3xl shadow-md text-white mt-8"
            >
              UNDO
            </button>
            <button
              onClick={() => dispatch(resetMatch())}
              className="bg-red-600 rounded-md px-8 py-4 text-3xl shadow-md text-white mt-8"
            >
              Restart
            </button>
            <button
              onClick={() => dispatch(redo())}
              className="bg-cyan-600 rounded-md px-8 py-4 text-3xl shadow-md text-white mt-8"
            >
              REDO
            </button>
          </div>
          <Stopwatch />
        </div>
      </ThemeProvider>
    );
  } else {
    return <Welcome />;
  }
}

export default App;
