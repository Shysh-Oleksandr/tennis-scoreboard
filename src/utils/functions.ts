import { ISet, PlayerTypes } from "../features/scoreboard/scoreboardSlice";
import { v4 as uuidv4 } from "uuid";
import { IPlayer } from "./../features/scoreboard/scoreboardSlice";

const pointsToGamePoints = {
  0: "0",
  1: "15",
  2: "30",
  3: "40",
  4: "Ad",
};

type ObjectKey = keyof typeof pointsToGamePoints;

export function convertToGamePoints(points: number): string {
  if (points > 4 || points < 0) {
    points = 4;
  }
  const pointsKey = points as ObjectKey;

  return pointsToGamePoints[pointsKey];
}

export function generateEmptySets(setsNumber: number): ISet[] {
  const sets: ISet[] = new Array(setsNumber)
    .fill({
      firstPlayerGames: 0,
      secondPlayerGames: 0,
    })
    .map((set, index) => {
      return { ...set, isCurrentSet: index === 0, id: uuidv4() };
    });

  return sets;
}

export function checkIfFirstPlayer(
  players: IPlayer[],
  id: string
): PlayerTypes {
  return players[0].id === id
    ? PlayerTypes.FIRST_PLAYER
    : PlayerTypes.SECOND_PLAYER;
}
