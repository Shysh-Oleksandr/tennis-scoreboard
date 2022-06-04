import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  PlayerTypes,
  PointTypes,
} from "../features/scoreboard/scoreboardSlice";
import { checkIfFirstPlayer } from "../utils/functions";
import Player from "./Player";

const Scoreboard = () => {
  const { players, currentGame } = useAppSelector((store) => store.scoreboard);
  return (
    <div className="max-w-4xl mx-auto pt-32">
      <div className="relative">
        {currentGame.pointType !== PointTypes.DEFAULT_POINT && (
          <span className="point-type absolute -top-11 left-0 text-lg px-8 py-2 bg-slate-800 text-white rounded-md">
            {currentGame.pointType}
          </span>
        )}
        {players.map((player) => {
          const playerType: PlayerTypes = checkIfFirstPlayer(
            players,
            player.id
          );
          return <Player {...player} playerType={playerType} key={player.id} />;
        })}
      </div>
    </div>
  );
};

export default Scoreboard;
