import React from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Scoreboard from "./components/Scoreboard";
import Stopwatch from "./components/Stopwatch";
import Welcome from "./components/Welcome";
import { backToMenu } from "./features/scoreboard/menuSlice";
import { redo, resetMatch, undo } from "./features/scoreboard/scoreboardSlice";

function App() {
  const dispatch = useAppDispatch();
  const { isStarted } = useAppSelector((store) => store.menu);

  if (isStarted) {
    return (
      <div className="app text-center  pt-32 bg-green-100 w-full h-full">
        <Scoreboard />
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
        <Stopwatch />
      </div>
    );
  } else {
    return <Welcome />;
  }
}

export default App;
