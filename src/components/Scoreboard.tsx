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

const Scoreboard = () => {
  const dispatch = useAppDispatch();
  const { players, pointType, isDeuce, breakpointNumber, isTiebreak, isWon } =
    useAppSelector((store) => store.scoreboard);

  function getPointType(): String {
    let pointTypeString: String = pointType.toString();

    if (isTiebreak) pointTypeString = "TIE BREAK";
    if (isDeuce) pointTypeString = "DEUCE";
    if (pointType !== PointTypes.DEFAULT_POINT) {
      pointTypeString =
        breakpointNumber > 1 ? `${breakpointNumber} ${pointType}` : pointType;
    }

    return pointTypeString;
  }

  useEffect(() => {
    dispatch(resetMatch());
  }, []);

  return (
    <div className="max-w-4xl mx-auto relative">
      {isWon && (
        <h3 className="text-3xl absolute -top-12 left-1/2 -translate-x-1/2">
          {players.find((player) => player.isWinner)?.name + " won!" ||
            "Victory!"}
        </h3>
      )}
      <div className="relative shadow-2xl">
        {getPointType() !== PointTypes.DEFAULT_POINT && (
          <span className="point-type absolute -top-11 left-0 text-lg px-8 py-2 bg-slate-800 text-white rounded-md">
            {getPointType()}
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
