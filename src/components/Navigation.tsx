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
    <div className="flex items-center justify-center md:mt-12 sm:mt-10 mt-8 mx-8">
      <button
        onClick={() => dispatch(backToMenu())}
        className="absolute sm:top-8 top-4 sm:left-8 left-4 transition-all sm:text-3xl text-2xl flex items-center bg-slate-900 sm:bg-transparent bg-opacity-30  rounded-md sm:p-0 px-3 py-2  text-white sm:hover:text-[#d6cece] hover:bg-opacity-40"
      >
        <span className="mr-4 sm:text-4xl text-3xl">
          <CgArrowLongLeft />
        </span>
        Menu
      </button>
      <button
        onClick={() => dispatch(undo())}
        className="bg-[#36246B] hover:bg-[#2c1e57] navigation-btn"
      >
        <ImUndo2 />
      </button>
      <button
        onClick={() => dispatch(resetMatch())}
        className="bg-[#6B2435] hover:bg-[#571d2a] navigation-btn"
      >
        <VscDebugRestart />
      </button>
      <button
        onClick={() => dispatch(redo())}
        className="bg-[#596B24] hover:bg-[#4e5e1f] navigation-btn"
      >
        <ImRedo2 />
      </button>
    </div>
  );
};

export default Navigation;
