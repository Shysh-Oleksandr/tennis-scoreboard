import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import {
  addGameToWinner,
  generateEmptySet,
  generateEmptySets,
  getPlayerGames,
  getPlayerPoints,
  getScore,
  isLastGamePoint,
  isLastSet,
  isLastSetGame,
} from "../../utils/functions";
import { addPointToWinner } from "./../../utils/functions";

export enum PointTypes {
  DEFAULT_POINT = "DEFAULT POINT",
  BREAK_POINT = "BREAK POINT",
  SET_POINT = "SET POINT",
  MATCH_POINT = "MATCH POINT",
}

export enum PlayerTypes {
  FIRST_PLAYER = "First player",
  SECOND_PLAYER = "Second player",
}

export interface IPlayer {
  name: string;
  id: string;
}

export interface IGame {
  firstPlayerPoints: number;
  secondPlayerPoints: number;
}

export interface ISet {
  firstPlayerGames: number;
  secondPlayerGames: number;
  firstPlayerTiebreakPoints?: number;
  secondPlayerTiebreakPoints?: number;
  winner?: PlayerTypes;
  id: string;
}

export interface scoreboardState {
  players: IPlayer[];
  currentServer: PlayerTypes;
  currentGame: IGame;
  sets: ISet[];
  isTiebreak: boolean;
  isDeuce: boolean;
  pointType: PointTypes;
  breakpointNumber: number;
  currentSet: number;
  bestOfNumber: number;
  id: string;
}

const initialState: scoreboardState = {
  players: [
    { name: "John", id: uuidv4() },
    { name: "Frank", id: uuidv4() },
  ],
  currentGame: {
    firstPlayerPoints: 0,
    secondPlayerPoints: 0,
  },
  currentSet: 0,
  isTiebreak: false,
  isDeuce: false,
  breakpointNumber: 0,
  pointType: PointTypes.DEFAULT_POINT,

  currentServer: PlayerTypes.FIRST_PLAYER,
  sets: generateEmptySets(3),
  bestOfNumber: 3,
  id: uuidv4(),
};

function checkBreackPoint(state: scoreboardState) {
  const receiverPoints: number = getPlayerPoints(
    state,
    state.currentServer !== PlayerTypes.FIRST_PLAYER
  );
  const serverPoints: number = getPlayerPoints(
    state,
    state.currentServer === PlayerTypes.FIRST_PLAYER
  );
  if (isLastGamePoint(receiverPoints, serverPoints)) {
    state.pointType = PointTypes.BREAK_POINT;
    state.breakpointNumber = receiverPoints - serverPoints;
  } else {
    state.pointType = PointTypes.DEFAULT_POINT;
  }
}

function checkSetPoint(state: scoreboardState, isFirstPlayer: boolean) {
  const winnerGames = getPlayerGames(state, isFirstPlayer);
  const loserGames = getPlayerGames(state, !isFirstPlayer);
  const winnerPoints = getPlayerPoints(state, isFirstPlayer);
  const loserPoints = getPlayerPoints(state, !isFirstPlayer);

  const checkPointCondition =
    (isLastGamePoint(winnerPoints, loserPoints) &&
      isLastSetGame(winnerGames, loserGames)) ||
    (isLastGamePoint(loserPoints, winnerPoints) &&
      isLastSetGame(loserGames, winnerGames));

  const tieBreakCheckPointCondition =
    state.isTiebreak &&
    (isLastGamePoint(winnerPoints, loserPoints, 7) ||
      isLastGamePoint(loserPoints, winnerPoints, 7));

  if (
    (checkPointCondition && !state.isTiebreak) ||
    tieBreakCheckPointCondition
  ) {
    state.pointType = PointTypes.SET_POINT;
    state.breakpointNumber = Math.abs(winnerPoints - loserPoints);

    // If it is last set than it's match point.
    if (state.currentSet === state.sets.length - 1) {
      state.pointType = PointTypes.MATCH_POINT;
    }
  } else if (state.pointType === PointTypes.SET_POINT) {
    state.pointType = PointTypes.DEFAULT_POINT;
  }
}

function handleTiebreak(
  state: scoreboardState,
  isFirstPlayer: boolean,
  winnerPoints: number,
  loserPoints: number
) {
  // Change current server.
  if ((winnerPoints + loserPoints) % 2 === 0) {
    scoreboardSlice.caseReducers.changeCurrentServer(state);
  }
  // Add point to winner.
  addPointToWinner(state, isFirstPlayer);
  // Check if win tiebreak(set).
  if (isLastGamePoint(winnerPoints, loserPoints, 7)) {
    addGameToWinner(state, isFirstPlayer);

    // Saving tiebreak points.
    state.sets[state.currentSet].firstPlayerTiebreakPoints =
      state.currentGame.firstPlayerPoints;
    state.sets[state.currentSet].secondPlayerTiebreakPoints =
      state.currentGame.secondPlayerPoints;
    // Moving to next set.
    state.currentSet++;
    // Reseting game.
    state.isTiebreak = false;
    scoreboardSlice.caseReducers.resetCurrentGame(state);
  }
}

function handleGameWin(state: scoreboardState, isFirstPlayer: boolean) {
  scoreboardSlice.caseReducers.resetCurrentGame(state);
  !state.isTiebreak && scoreboardSlice.caseReducers.changeCurrentServer(state);

  const winnerGames = getPlayerGames(state, isFirstPlayer);
  const loserGames = getPlayerGames(state, !isFirstPlayer);

  addGameToWinner(state, isFirstPlayer);
  // Check if win set.
  if (isLastSetGame(winnerGames, loserGames)) {
    // Define this set's winner.
    state.sets[state.currentSet].winner = isFirstPlayer
      ? PlayerTypes.FIRST_PLAYER
      : PlayerTypes.SECOND_PLAYER;

    const [firstPlayerScore, secondPlayerScore] = getScore(state);
    console.log(`${firstPlayerScore}:${secondPlayerScore}`);
    const setsToWin = Math.ceil(state.bestOfNumber / 2);

    // Check if it is the last visible set,
    if (isLastSet(state)) {
      const winnerName = isFirstPlayer
        ? state.players[0].name
        : state.players[1].name;

      // If none of players won enough sets.
      if (firstPlayerScore < setsToWin && secondPlayerScore < setsToWin) {
        // Add a new visible set.
        state.sets = [...state.sets, generateEmptySet()];
        state.currentSet++;
      } else {
        console.log(winnerName);
      }
    } else {
      state.currentSet++;
    }
  }
  // Check if tiebreak
  else if (winnerGames === 5 && loserGames === 6) {
    state.isTiebreak = true;
    state.currentServer = PlayerTypes.FIRST_PLAYER;
  }
}

export const scoreboardSlice = createSlice({
  name: "scoreboard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPoint: (state, { payload }: PayloadAction<PlayerTypes>) => {
      const isFirstPlayer = payload === PlayerTypes.FIRST_PLAYER;
      let winnerPoints: number = getPlayerPoints(state, isFirstPlayer);
      let loserPoints: number = getPlayerPoints(state, !isFirstPlayer);

      // If there's a tiebreak.
      if (state.isTiebreak) {
        handleTiebreak(state, isFirstPlayer, winnerPoints, loserPoints);
      } else {
        // Check deuce.
        if (winnerPoints === 2 && loserPoints === 3) {
          state.isDeuce = true;
        }

        // Check game win.
        if ((winnerPoints === 3 && loserPoints < 3) || winnerPoints === 4) {
          handleGameWin(state, isFirstPlayer);
        }
        // Handle deuce(substract point).
        else if (winnerPoints === 3 && loserPoints === 4) {
          addPointToWinner(state, !isFirstPlayer, -1);
        }
        // Add point to winner.
        else {
          addPointToWinner(state, isFirstPlayer);
        }

        // Check if break point.
        checkBreackPoint(state);
      }
      // Check if set point.
      checkSetPoint(state, isFirstPlayer);
    },
    resetCurrentGame: (state) => {
      state.currentGame = initialState.currentGame;
      state.isDeuce = false;
      state.isTiebreak = false;
      state.pointType = PointTypes.DEFAULT_POINT;
      state.breakpointNumber = 0;
    },
    resetMatch: (state) => {
      return { ...initialState, players: state.players };
    },
    changeCurrentServer: (state) => {
      // Change a current server.
      state.currentServer =
        state.currentServer === PlayerTypes.FIRST_PLAYER
          ? PlayerTypes.SECOND_PLAYER
          : PlayerTypes.FIRST_PLAYER;
    },
  },
});

export const { addPoint, resetMatch } = scoreboardSlice.actions;

export default scoreboardSlice.reducer;
