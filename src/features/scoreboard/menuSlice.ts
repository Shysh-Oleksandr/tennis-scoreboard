import { createSlice } from "@reduxjs/toolkit";

export interface IPlayer {
  name: string;
  id: string;
}

export interface menuState {
  isStarted: boolean;
  bestOfSets: number;
}

const initialState: menuState = {
  isStarted: false,
  bestOfSets: 3,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    startGame: (state) => {
      state.isStarted = true;
    },
    backToMenu: (state) => {
      state.isStarted = false;
    },
  },
});

export const { startGame, backToMenu } = menuSlice.actions;

export default menuSlice.reducer;
