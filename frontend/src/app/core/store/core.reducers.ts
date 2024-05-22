import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { State } from "./core.state";
import * as UserReducer from "./user/user.reducer";

export const reducers: ActionReducerMap<State> = {
  //menus: MenusReducer.reducer,
  // ✨ New 👇
  Auth: UserReducer.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];