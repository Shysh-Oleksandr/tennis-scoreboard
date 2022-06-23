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
    <div
      className="bg-teal-800 scoreboard relative disable-select text-white  flex items-center justify-between cursor-pointer"
      onClick={() => dispatch(addPoint(playerType))}
    >
      <div className="font-bold md:text-5xl sm:text-4xl text-2xl text-left md:p-6 sm:p-4 p-3 relative md:ml-10 sm:ml-6 ml-4 shrink-0 grow basis-1/4">
        <h3>{name}</h3>
        {currentServer === playerType && !isWon && (
          <span className="absolute md:-left-12 sm:-left-7 -left-5 top-1/2 -translate-y-1/2 text-center md:p-6 sm:p-4 p-3 tracking-tighter">
            {"//"}
          </span>
        )}
        {isWinner && isWon && (
          <span className="absolute top-1/2 -translate-y-1/2 -left-7 z-10 text-5xl">
            <GiCrown />
          </span>
        )}
      </div>
      <div className="flex items-center">
        <div className="flex items-center overflow-x-auto  relative">
          {sets.map((set, index) => {
            return (
              <div
                key={set.id}
                className={`md:text-5xl sm:text-4xl text-3xl max-w bg-transparent md:px-8 sm:px-7 px-5 md:py-6 py-4 ${
                  currentSet === index && !isWon ? "current-set" : ""
                } ${
                  set.winner &&
                  set.winner === PlayerTypes.FIRST_PLAYER &&
                  isFirstPlayer
                    ? "text-[#46a676] font-bold"
                    : ""
                } ${
                  set.winner &&
                  set.winner === PlayerTypes.SECOND_PLAYER &&
                  !isFirstPlayer
                    ? "text-[#46a676] font-bold"
                    : ""
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
        </div>
        <div className="md:text-5xl sm:text-4xl text-3xl current-game text-teal-800 md:w-24 sm:w-20 w-16  md:py-6 py-4 ">
          {isTiebreak
            ? playerGamePoints
            : convertToGamePoints(playerGamePoints)}
        </div>
      </div>
    </div>
  );
};

export default Player;
