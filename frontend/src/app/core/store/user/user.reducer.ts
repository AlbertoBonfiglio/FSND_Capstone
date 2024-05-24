import { Action, createReducer, on } from "@ngrx/store";
import * as AuthActions from "./user.actions";
import { AuthState, initialAuthState } from "./user.state";

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.userChangedFromAuth0SDK, (state, { user }) => ({
    ...state,
    user: user,
  })),
  on(AuthActions.userAppDataLoaded,
     AuthActions.userDefaultAppDataCreated, 
    (state, { data }) => ({
    ...state,
    appData: data,
  }))
);

export function authReducerFn(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}