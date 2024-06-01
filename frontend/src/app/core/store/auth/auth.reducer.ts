import { Action, createReducer, on } from "@ngrx/store";
import * as AuthActions from "./auth.actions";
import { AuthState, initialAuthState } from "./auth.state";

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.userChangedFromAuth0SDK, (state, { user }) => ({
    ...state,
    user: user,
  })),

);

export function authReducerFn(state: AuthState | undefined, action: Action) {
  return authReducer(state, action);
}