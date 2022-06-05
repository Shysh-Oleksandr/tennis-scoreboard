import {
  ISet,
  PlayerTypes,
  scoreboardState,
} from "../features/scoreboard/scoreboardSlice";
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
  if (setsNumber > 3) {
    setsNumber = 3;
  }
  const sets: ISet[] = new Array(setsNumber)
    .fill({
      firstPlayerGames: 0,
      secondPlayerGames: 0,
    })
    .map((set, index) => {
      return { ...set, id: uuidv4() };
    });

  return sets;
}

export function generateEmptySet(): ISet {
  const set: ISet = {
    firstPlayerGames: 0,
    secondPlayerGames: 0,
    id: uuidv4(),
  };
  return set;
}

export function checkIfFirstPlayer(
  players: IPlayer[],
  id: string
): PlayerTypes {
  return players[0].id === id
    ? PlayerTypes.FIRST_PLAYER
    : PlayerTypes.SECOND_PLAYER;
}

export function isLastGamePoint(
  winnerPoints: number,
  loserPoints: number,
  pointToWin: number = 4
) {
  return winnerPoints >= pointToWin - 1 && winnerPoints - loserPoints >= 1;
}

export function isLastSetGame(winnerGames: number, loserGames: number) {
  return winnerGames >= 5 && winnerGames - loserGames >= 1;
}

export function addGameToWinner(
  state: scoreboardState,
  isFirstPlayer: boolean
) {
  const currentSet = state.sets[state.currentSet];
  isFirstPlayer
    ? currentSet.firstPlayerGames++
    : currentSet.secondPlayerGames++;
}

export function addPointToWinner(
  state: scoreboardState,
  isFirstPlayer: boolean,
  pointToAdd: number = 1
) {
  isFirstPlayer
    ? (state.currentGame.firstPlayerPoints += pointToAdd)
    : (state.currentGame.secondPlayerPoints += pointToAdd);
}

export function getPlayerPoints(
  state: scoreboardState,
  isFirstPlayer: boolean
): number {
  return isFirstPlayer
    ? state.currentGame.firstPlayerPoints
    : state.currentGame.secondPlayerPoints;
}

export function getPlayerGames(
  state: scoreboardState,
  isFirstPlayer: boolean
): number {
  return isFirstPlayer
    ? state.sets[state.currentSet].firstPlayerGames
    : state.sets[state.currentSet].secondPlayerGames;
}

export function isLastSet(state: scoreboardState) {
  return state.currentSet === state.sets.length - 1;
}

export function getScore(state: scoreboardState) {
  let firstPlayerScore = 0;
  let secondPlayerScore = 0;
  state.sets.forEach((set) => {
    if (set.winner) {
      set.winner === PlayerTypes.FIRST_PLAYER
        ? firstPlayerScore++
        : secondPlayerScore++;
    }
  });

  return [firstPlayerScore, secondPlayerScore];
}
