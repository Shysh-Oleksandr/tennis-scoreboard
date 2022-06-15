import React from "react";
import { useAppSelector } from "../app/hooks";
import { PointTypes } from "../features/scoreboard/scoreboardSlice";

const PointType = () => {
  const { pointType, isDeuce, breakpointNumber, isTiebreak } = useAppSelector(
    (store) => store.scoreboard
  );
  function getPointType(): string {
    let pointTypeString: string = pointType.toString();

    if (isTiebreak) pointTypeString = "TIE BREAK";
    if (isDeuce) pointTypeString = "DEUCE";
    if (pointType !== PointTypes.DEFAULT_POINT) {
      pointTypeString =
        breakpointNumber > 1 ? `${breakpointNumber} ${pointType}` : pointType;
    }

    return pointTypeString;
  }
  return getPointType() !== PointTypes.DEFAULT_POINT ? (
    <span className="point-type absolute sm:-top-16 -top-12 left-0 sm:text-2xl text-xl sm:px-10 px-6 sm:py-4 py-3 bg-slate-800 text-white rounded-t-md">
      {getPointType()}
    </span>
  ) : null;
};

export default PointType;
