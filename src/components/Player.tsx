import React from "react";
import { useAppSelector } from "../app/hooks";
import { IPlayer } from "../features/scoreboard/scoreboardSlice";

interface PlayerProps extends IPlayer {
  isFirstPlayer: boolean;
}

const Player = ({ name, isServing, id, isFirstPlayer }: PlayerProps) => {
  const { sets, currentGame } = useAppSelector((store) => store.scoreboard);
  return (
    <div className="bg-slate-700 rounded-md text-white border-l-8 border-solid border-teal-500 flex items-center justify-between">
      <h3 className="font-bold text-2xl text-left p-3">{name}</h3>
      <div className="sets relative">
        {isServing && (
          <span className="absolute -left-8 top-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-teal-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </span>
        )}
        <div className="flex items-center">
          {sets.map((set) => {
            return (
              <div
                key={set.id}
                className="text-xl bg-slate-600  px-4 py-3 rounded-md"
              >
                {isFirstPlayer ? set.firstPlayerGames : set.secondPlayerGames}
              </div>
            );
          })}
          <div className="text-xl bg-teal-400  px-4 py-3 rounded-md">
            {isFirstPlayer
              ? currentGame.firstPlayerPoints
              : currentGame.secondPlayerPoints}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
