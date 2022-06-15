import React, { useEffect } from "react";
import { useAppSelector } from "../app/hooks";
import {
  PlayerTypes,
  resetMatch,
} from "../features/scoreboard/scoreboardSlice";
import { checkIfFirstPlayer } from "../utils/functions";
import { useAppDispatch } from "./../app/hooks";
import Player from "./Player";
import PointType from "./PointType";

const Scoreboard = () => {
  const dispatch = useAppDispatch();
  const { players, isWon } = useAppSelector((store) => store.scoreboard);

  useEffect(() => {
    dispatch(resetMatch());
  }, []);

  return (
    <div className="md:max-w-[80vw] max-w-[95vw] mx-auto relative">
      {isWon && (
        <h3 className="md:text-4xl text-2xl absolute -top-16 left-1/2 -translate-x-1/2 text-white">
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
