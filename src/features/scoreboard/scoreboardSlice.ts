import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export enum PointTypes {
  DEFAULT_POINT = "DEFAULT POINT",
  BREAK_POINT = "BREAK POINT",
  SET_POINT = "SET POINT",
  MATCH_POINT = "MATCH POINT",
}

export interface IPlayer {
  name: string;
  isServing: boolean;
  id: string;
}

export interface IGame {
  firstPlayerPoints: number;
  secondPlayerPoints: number;
  isTiebreak: boolean;
  isDeuce: boolean;
}

export interface ISet {
  firstPlayerGames: number;
  secondPlayerGames: number;
  isCurrentSet: boolean;
  id: string;
}

export interface scoreboardState {
  players: IPlayer[];
  // currentServer: IPlayer;
  pointType: PointTypes;
  currentGame: IGame;
  sets: ISet[];
  id: string;
}

export function checkIfFirstPlayer(players: IPlayer[], id: string) {
  return players[0].id === id;
}

function generateEmptySets(setsNumber: number): ISet[] {
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

const initialState: scoreboardState = {
  players: [
    { name: "John", isServing: true, id: uuidv4() },
    { name: "Frank", isServing: false, id: uuidv4() },
  ],
  currentGame: {
    firstPlayerPoints: 0,
    secondPlayerPoints: 0,
    isTiebreak: false,
    isDeuce: false,
  },
  sets: generateEmptySets(3),
  pointType: PointTypes.DEFAULT_POINT,
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
    addPoint: (state, { payload }: PayloadAction<boolean>) => {
      const isFirstPlayer = payload;
      const winnerPoints: number = isFirstPlayer
        ? state.currentGame.firstPlayerPoints
        : state.currentGame.secondPlayerPoints;
      const loserPoints: number = !isFirstPlayer
        ? state.currentGame.firstPlayerPoints
        : state.currentGame.secondPlayerPoints;

      if ((winnerPoints === 3 && loserPoints < 3) || winnerPoints === 4) {
        scoreboardSlice.caseReducers.resetCurrentGame(state);
      } else if (winnerPoints === 3 && loserPoints === 4) {
        !isFirstPlayer
          ? (state.currentGame.firstPlayerPoints -= 1)
          : (state.currentGame.secondPlayerPoints -= 1);
      } else {
        isFirstPlayer
          ? (state.currentGame.firstPlayerPoints += 1)
          : (state.currentGame.secondPlayerPoints += 1);
      }
    },
    resetCurrentGame: (state) => {
      state.currentGame = initialState.currentGame;
    },
  },
});

export const { addPoint } = scoreboardSlice.actions;

export default scoreboardSlice.reducer;
