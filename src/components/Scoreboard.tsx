import React from "react";
import { useAppSelector } from "../app/hooks";
import {
  PlayerTypes,
  PointTypes,
} from "../features/scoreboard/scoreboardSlice";
import { checkIfFirstPlayer } from "../utils/functions";
import Player from "./Player";

const Scoreboard = () => {
  const { players, pointType, isDeuce, breakpointNumber, isTiebreak } =
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

  return (
    <div className="max-w-4xl mx-auto shadow-2xl">
      <div className="relative">
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
