import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import { generateEmptySets } from "../../utils/functions";

export enum PointTypes {
  DEFAULT_POINT = "DEFAULT POINT",
  BREAK_POINT = "BREAK POINT",
  SET_POINT = "SET POINT",
  MATCH_POINT = "MATCH POINT",
  DEUCE = "DEUCE",
  TIEBREAK = "TIEBREAK",
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
  pointType: PointTypes;
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
    pointType: PointTypes.DEFAULT_POINT,
  },
  currentSet: 0,
  isTiebreak: false,

  currentServer: PlayerTypes.FIRST_PLAYER,
  sets: generateEmptySets(3),
  id: uuidv4(),
};

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
      const winnerPoints: number = isFirstPlayer
        ? state.currentGame.firstPlayerPoints
        : state.currentGame.secondPlayerPoints;
      const loserPoints: number = !isFirstPlayer
        ? state.currentGame.firstPlayerPoints
        : state.currentGame.secondPlayerPoints;

      // If there's a tiebreak.
      if (state.isTiebreak) {
        // Change current server.
        if ((winnerPoints + loserPoints) % 2 === 0) {
          scoreboardSlice.caseReducers.changeCurrentServer(state);
        }
        // Add point to winner.
        isFirstPlayer
          ? (state.currentGame.firstPlayerPoints += 1)
          : (state.currentGame.secondPlayerPoints += 1);
        // Check if win tiebreak(set).
        if (winnerPoints >= 6 && winnerPoints - loserPoints >= 1) {
          isFirstPlayer
            ? (state.sets[state.currentSet].firstPlayerGames += 1)
            : (state.sets[state.currentSet].secondPlayerGames += 1);

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
          state.currentGame.pointType = PointTypes.DEUCE;
        }

        // Check if win game.
        if ((winnerPoints === 3 && loserPoints < 3) || winnerPoints === 4) {
          scoreboardSlice.caseReducers.resetCurrentGame(state);
          !state.isTiebreak &&
            scoreboardSlice.caseReducers.changeCurrentServer(state);

          const winnerGames = isFirstPlayer
            ? (state.sets[state.currentSet].firstPlayerGames += 1)
            : (state.sets[state.currentSet].secondPlayerGames += 1);

          const loserGames = !isFirstPlayer
            ? state.sets[state.currentSet].firstPlayerGames
            : state.sets[state.currentSet].secondPlayerGames;

          // Check if win set.
          if (winnerGames >= 6 && winnerGames - loserGames >= 2) {
            state.currentSet += 1;
          }
          // Check if tiebreak
          else if (winnerGames === 6 && loserGames === 6) {
            state.isTiebreak = true;
            state.currentServer = PlayerTypes.FIRST_PLAYER;

            // state.currentGame.pointType = PointTypes.TIEBREAK;
          }
        }
        // Handle deuce.
        else if (winnerPoints === 3 && loserPoints === 4) {
          !isFirstPlayer
            ? (state.currentGame.firstPlayerPoints -= 1)
            : (state.currentGame.secondPlayerPoints -= 1);
        }
        // Add point to winner.
        else {
          isFirstPlayer
            ? (state.currentGame.firstPlayerPoints += 1)
            : (state.currentGame.secondPlayerPoints += 1);
        }
      }
    },
    resetCurrentGame: (state) => {
      state.currentGame = initialState.currentGame;
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
