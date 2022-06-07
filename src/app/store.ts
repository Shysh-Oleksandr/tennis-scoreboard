import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import scoreboardReducer from "../features/scoreboard/scoreboardSlice";
import menuReducer from "../features/scoreboard/menuSlice";

export const store = configureStore({
  reducer: {
    scoreboard: scoreboardReducer,
    menu: menuReducer,
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
