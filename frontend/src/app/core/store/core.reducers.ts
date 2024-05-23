import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import * as UserReducer from "./user/user.reducer";
import { AppState } from "./core.state";

export const reducers: ActionReducerMap<AppState> = {
  //menus: MenusReducer.reducer,
  // ✨ New 👇
  auth: UserReducer.reducer,
};

export const metaReducers: MetaReducer<AppState>[] = [];