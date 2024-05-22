import { Action, createReducer, on } from "@ngrx/store";
import { initialState, UserState } from "./user.state";
import * as UserActions from "./user.actions";

const userReducer = createReducer(
  initialState,
  on(UserActions.userChangedFromAuth0SDK, (state, { user }) => ({
    ...state,
    user: user,
  }))
);

export function reducer(state: UserState | undefined, action: Action) {
  return userReducer(state, action);
}