import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  addPoint,
  IPlayer,
  PlayerTypes,
} from "../features/scoreboard/scoreboardSlice";
import { useAppDispatch } from "./../app/hooks";
import { convertToGamePoints } from "./../utils/functions";
import { GiCrown } from "react-icons/gi";

interface PlayerProps extends IPlayer {
  playerType: PlayerTypes;
}

const Player = ({ name, isWinner, playerType }: PlayerProps) => {
  const { sets, currentGame, currentServer, currentSet, isTiebreak, isWon } =
    useAppSelector((store) => store.scoreboard);
  const dispatch = useAppDispatch();

  const isFirstPlayer = playerType === PlayerTypes.FIRST_PLAYER;

  const playerGamePoints = isFirstPlayer
    ? currentGame.firstPlayerPoints
    : currentGame.secondPlayerPoints;

  return (
    <div className="bg-slate-700 relative rounded-md text-white border-l-8 border-solid border-teal-500 flex items-center justify-between">
      <h3 className="font-bold text-2xl text-left p-3 relative">
        {name}
        {isWinner && (
          <span className="absolute top-1/2 -translate-y-1/2 -right-6 z-10 text-3xl">
            <GiCrown />
          </span>
        )}
      </h3>
      <div
        className="sets relative cursor-pointer"
        onClick={() => dispatch(addPoint(playerType))}
      >
        {currentServer === playerType && !isWon && (
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
          {sets.map((set, index) => {
            return (
              <div
                key={set.id}
                className={`text-xl bg-slate-600 px-4 py-3 rounded-md ${
                  currentSet === index ? "bg-slate-500" : ""
                }`}
              >
                {isFirstPlayer ? set.firstPlayerGames : set.secondPlayerGames}
                <sup>
                  {isFirstPlayer
                    ? set.firstPlayerTiebreakPoints
                    : set.secondPlayerTiebreakPoints}
                </sup>
              </div>
            );
          })}
          <div className="text-xl bg-teal-400  w-16 px-2 py-3 rounded-md">
            {isTiebreak
              ? playerGamePoints
              : convertToGamePoints(playerGamePoints)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
