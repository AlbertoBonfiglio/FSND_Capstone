import { createAction, props } from "@ngrx/store";
import { User as Auth0User } from "@auth0/auth0-spa-js";

export const allAuthActions = {
  loginFlowInitiated: createAction("Login Flow Initiated"),
  loginFlowLoadAppUserData: createAction("Login Flow LoadAppUserData"),
  loginFlowCompleted: createAction("Login Flow Completed"),
  logoutFlowInitiated: createAction("Logout Flow Initiated"),
};

export const userChangedFromAuth0SDK = createAction(
  "[Auth0 SDK] User Changed",
  props<{ user: Auth0User|null }>()
);

export const userAppDataLoaded = createAction(
  "[Auth0 SDK] User App Data Loaded",
  props<{ data: {}|null }>()
);

export const createDefaultAppUserData = createAction(
  "[Auth0 SDK] Create Default User App Data",
  props<{ data: {}|null }>()
);

export const userDefaultAppDataCreated = createAction(
  "[Auth0 SDK] Default User App Data Loaded",
  props<{ data: {}|null }>()
);

export const refreshDataset = createAction("[Auth0 SDK] Refresh data");