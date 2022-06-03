import { createSlice } from "@reduxjs/toolkit";
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

const initialState: scoreboardState = {
  players: [
    { name: "John", isServing: true, id: uuidv4() },
    { name: "Frank", isServing: false, id: uuidv4() },
  ],
  pointType: PointTypes.DEFAULT_POINT,
  currentGame: {
    firstPlayerPoints: 0,
    secondPlayerPoints: 0,
    isTiebreak: false,
  },
  sets: [
    {
      firstPlayerGames: 0,
      secondPlayerGames: 0,
      isCurrentSet: true,
      id: uuidv4(),
    },
  ],
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
    // Use the PayloadAction type to declare the contents of `action.payload`
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export const {} = scoreboardSlice.actions;

export default scoreboardSlice.reducer;
