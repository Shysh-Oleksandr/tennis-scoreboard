import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { generateEmptySets } from "../../utils/functions";

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
  id: uuidv4(),
};

function checkPointType(
  state: scoreboardState,
  winnerPoints: number,
  loserPoints: number,
  pointType: PointTypes
) {
  if (isLastGamePoint(winnerPoints, loserPoints)) {
    state.pointType = pointType;
    state.breakpointNumber = winnerPoints - loserPoints;
  } else {
    state.pointType = PointTypes.DEFAULT_POINT;
  }
}

function isLastGamePoint(
  winnerPoints: number,
  loserPoints: number,
  pointToWin: number = 4
) {
  return winnerPoints >= pointToWin - 1 && winnerPoints - loserPoints >= 1;
}

function isLastSetGame(winnerGames: number, loserGames: number) {
  return winnerGames >= 5 && winnerGames - loserGames >= 1;
}

function addGameToWinner(state: scoreboardState, isFirstPlayer: boolean) {
  isFirstPlayer
    ? (state.sets[state.currentSet].firstPlayerGames += 1)
    : (state.sets[state.currentSet].secondPlayerGames += 1);
}

function addPointToWinner(
  state: scoreboardState,
  isFirstPlayer: boolean,
  pointToAdd: number = 1
) {
  isFirstPlayer
    ? (state.currentGame.firstPlayerPoints += pointToAdd)
    : (state.currentGame.secondPlayerPoints += pointToAdd);
}

function getPlayerPoints(
  state: scoreboardState,
  isFirstPlayer: boolean
): number {
  return isFirstPlayer
    ? state.currentGame.firstPlayerPoints
    : state.currentGame.secondPlayerPoints;
}

function getPlayerGames(
  state: scoreboardState,
  isFirstPlayer: boolean
): number {
  return isFirstPlayer
    ? state.sets[state.currentSet].firstPlayerGames
    : state.sets[state.currentSet].secondPlayerGames;
}

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched. Thunks are
// typically used to make async requests.
// export const incrementAsync = createAsyncThunk(
//   'scoreboard/fetchCount',
//   async (amount: number) => {
//     const response = await fetchCount(amount);
//     // The value we return becomes the `fulfilled` action payload
//     return response.data;
//   }
// );

export const scoreboardSlice = createSlice({
  name: "scoreboard",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    addPoint: (state, { payload }: PayloadAction<PlayerTypes>) => {
      const isFirstPlayer = payload === PlayerTypes.FIRST_PLAYER;
      const winnerPoints: number = getPlayerPoints(state, isFirstPlayer);
      const loserPoints: number = getPlayerPoints(state, !isFirstPlayer);

      // If there's a tiebreak.
      if (state.isTiebreak) {
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
          state.currentSet += 1;
          // Reseting game.
          state.isTiebreak = false;
          scoreboardSlice.caseReducers.resetCurrentGame(state);
        }
      } else {
        // Check if deuce.
        if (winnerPoints === 2 && loserPoints === 3) {
          state.isDeuce = true;
        }

        // Check if win game.
        if ((winnerPoints === 3 && loserPoints < 3) || winnerPoints === 4) {
          scoreboardSlice.caseReducers.resetCurrentGame(state);
          !state.isTiebreak &&
            scoreboardSlice.caseReducers.changeCurrentServer(state);

          const winnerGames = getPlayerGames(state, isFirstPlayer);
          const loserGames = getPlayerGames(state, !isFirstPlayer);

          addGameToWinner(state, isFirstPlayer);
          // Check if win set.
          if (isLastSetGame(winnerGames, loserGames)) {
            state.currentSet += 1;
          }
          // Check if tiebreak
          else if (winnerGames === 5 && loserGames === 6) {
            state.isTiebreak = true;
            state.currentServer = PlayerTypes.FIRST_PLAYER;
          }
        }
        // Handle deuce(substract point).
        else if (winnerPoints === 3 && loserPoints === 4) {
          addPointToWinner(state, !isFirstPlayer, -1);
        }
        // Add point to winner.
        else {
          addPointToWinner(state, isFirstPlayer);
        }

        // Check if breakpoint.
        const serverPoints: number = getPlayerPoints(
          state,
          state.currentServer === PlayerTypes.FIRST_PLAYER
        );
        const receiverPoints: number = getPlayerPoints(
          state,
          state.currentServer !== PlayerTypes.FIRST_PLAYER
        );
        checkPointType(
          state,
          receiverPoints,
          serverPoints,
          PointTypes.BREAK_POINT
        );
        // Check if checkpoint.
        const winnerGames = getPlayerGames(state, isFirstPlayer);

        const loserGames = getPlayerGames(state, !isFirstPlayer);
        console.log(winnerGames, loserGames, winnerPoints, loserPoints);

        if (
          winnerPoints >= 2 &&
          winnerPoints - loserPoints >= 1 &&
          ((winnerGames >= 5 && winnerGames - loserGames >= 1) ||
            (loserGames >= 5 && loserGames - winnerGames >= 1))
        ) {
          console.log("setpoin");

          state.pointType = PointTypes.SET_POINT;
          state.breakpointNumber = winnerPoints - loserPoints;
        }
      }
    },
    resetCurrentGame: (state) => {
      state.currentGame = initialState.currentGame;
      state.isDeuce = false;
      state.isTiebreak = false;
      state.pointType = PointTypes.DEFAULT_POINT;
      state.breakpointNumber = 0;
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

export const { addPoint } = scoreboardSlice.actions;

export default scoreboardSlice.reducer;
