import React from "react";
import { CgArrowLongLeft } from "react-icons/cg";
import { ImRedo2, ImUndo2 } from "react-icons/im";
import { VscDebugRestart } from "react-icons/vsc";
import { backToMenu } from "../features/menu/menuSlice";
import { redo, resetMatch, undo } from "../features/scoreboard/scoreboardSlice";
import { useAppDispatch } from "./../app/hooks";
const Navigation = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="flex items-center justify-center mt-16">
      <button
        onClick={() => dispatch(backToMenu())}
        className="absolute top-8 left-8 transition-colors text-3xl flex items-center text-white hover:text-[#d6cece]"
      >
        <span className="mr-4 text-4xl">
          <CgArrowLongLeft />
        </span>
        Menu
      </button>
      <button
        onClick={() => dispatch(undo())}
        className="bg-[#36246B] rounded-md px-8 py-4 text-4xl transition-colors hover:bg-[#2c1e57]  flex items-center shadow-md text-white"
      >
        <ImUndo2 />
      </button>
      <button
        onClick={() => dispatch(resetMatch())}
        className="bg-[#6B2435] rounded-md px-8 py-4 text-4xl transition-colors hover:bg-[#571d2a] flex items-center shadow-md text-white"
      >
        <VscDebugRestart />
      </button>
      <button
        onClick={() => dispatch(redo())}
        className="bg-[#596B24] rounded-md px-8 py-4 text-4xl transition-colors hover:bg-[#4e5e1f] flex items-center shadow-md text-white"
      >
        <ImRedo2 />
      </button>
    </div>
  );
};

export default Navigation;
