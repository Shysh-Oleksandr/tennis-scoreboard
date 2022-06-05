import React from "react";
import Scoreboard from "./components/Scoreboard";
import { useAppDispatch } from "./app/hooks";
import { resetMatch } from "./features/scoreboard/scoreboardSlice";

function App() {
  const dispatch = useAppDispatch();

  return (
    <div className="app text-center  pt-32 bg-green-100 w-full h-full">
      <Scoreboard />
      <button
        onClick={() => dispatch(resetMatch())}
        className="bg-red-600 rounded-md px-8 py-4 text-3xl shadow-md text-white mt-8"
      >
        Restart
      </button>
    </div>
  );
}

export default App;
