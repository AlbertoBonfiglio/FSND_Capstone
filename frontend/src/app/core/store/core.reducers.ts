import { ActionReducerMap, MetaReducer } from "@ngrx/store";
//import * as UserReducer from "./user/user.reducer";
import { AppState } from "./core.state";
import { settingsReducer } from "./settings/settings.reducer";
import { userReducer } from "./user/user.reducer";

export const reducers: ActionReducerMap<AppState> = {
  auth: userReducer,
  settings: settingsReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];