import { Action, createReducer, on } from "@ngrx/store";
import { initialState, UserState } from "./user.state";
import * as UserActions from "./user.actions";

export const userReducer = createReducer(
  initialState,
  on(UserActions.userChangedFromAuth0SDK, (state, { user }) => ({
    ...state,
    user: user,
  })),
  on(UserActions.userAppDataLoaded, (state, { data }) => ({
    ...state,
    appData: data,
  }))
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}