import React, { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import {
  PlayerTypes,
  PointTypes,
  resetMatch,
} from "../features/scoreboard/scoreboardSlice";
import { checkIfFirstPlayer } from "../utils/functions";
import Player from "./Player";
import { useAppDispatch } from "./../app/hooks";
import PointType from "./PointType";

const Scoreboard = () => {
  const dispatch = useAppDispatch();
  const { players, isWon } = useAppSelector((store) => store.scoreboard);

  useEffect(() => {
    dispatch(resetMatch());
  }, []);

  return (
    <div className="max-w-4xl mx-auto relative">
      {isWon && (
        <h3 className="text-4xl absolute -top-16 left-1/2 -translate-x-1/2 text-white">
          {players.find((player) => player.isWinner)?.name + " won!" ||
            "Victory!"}
        </h3>
      )}
      <div className="relative shadow-2xl">
        <PointType />
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
