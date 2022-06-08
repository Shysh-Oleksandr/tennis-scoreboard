import { createSlice } from "@reduxjs/toolkit";

export interface IPlayer {
  name: string;
  id: string;
}

export interface menuState {
  isStarted: boolean;
}

const initialState: menuState = {
  isStarted: false,
};

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    startGame: (state) => {
      state.isStarted = true;
      sessionStorage.removeItem("previous_state");
      sessionStorage.removeItem("redo_state");
    },
    backToMenu: (state) => {
      state.isStarted = false;
    },
  },
});

export const { startGame, backToMenu } = menuSlice.actions;

export default menuSlice.reducer;
