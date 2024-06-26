import { createAction, props } from "@ngrx/store";
import { User as Auth0User } from "@auth0/auth0-spa-js";

export const allAuthActions = {
  loginFlowInitiated: createAction("Login Flow Initiated"),
  loginFlowCompleted: createAction("Login Flow Completed"),
  logoutFlowInitiated: createAction("Logout Flow Initiated"),
};

export const userChangedFromAuth0SDK = createAction(
  "[Auth0 SDK] User Changed",
  props<{ user: Auth0User|null }>()
);
