import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import scoreboardReducer from "../features/scoreboard/scoreboardSlice";

export const store = configureStore({
  reducer: {
    scoreboard: scoreboardReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
