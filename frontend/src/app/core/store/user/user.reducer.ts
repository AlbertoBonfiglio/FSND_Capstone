import { Action, createReducer, on } from "@ngrx/store";
import { UserState, initialUserState } from "./user.state";
import { appUserDataLoaded, defaultAppUserDataCreated } from "./user.actions";

export const userReducer = createReducer(
  initialUserState,
  on(appUserDataLoaded,
     defaultAppUserDataCreated, 
    (state, { data }) => ({
    ...state,
    appUser: data,
  })),
  
);

export function userReducerFn(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}