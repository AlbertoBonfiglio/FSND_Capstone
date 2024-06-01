import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { AppState } from "./core.state";
import { authReducer, robotReducer, settingsReducer, userReducer } from "./index";

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  settings: settingsReducer,
  robots: robotReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];