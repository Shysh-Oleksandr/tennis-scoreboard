import React from "react";
import { useAppSelector } from "../app/hooks";
import { checkIfFirstPlayer } from "../features/scoreboard/scoreboardSlice";
import Player from "./Player";

const Scoreboard = () => {
  const { players } = useAppSelector((store) => store.scoreboard);
  return (
    <div className="max-w-4xl mx-auto pt-32">
      {players.map((player) => {
        const isFirstPlayer = checkIfFirstPlayer(players, player.id);
        return (
          <Player {...player} isFirstPlayer={isFirstPlayer} key={player.id} />
        );
      })}
    </div>
  );
};

export default Scoreboard;
