import { createAction, props } from "@ngrx/store";
import { AppUser } from "../../models/user.model";
import { User } from "@auth0/auth0-angular";

export const loadAppUserData = createAction(
  "[User] Load data",
  props<{ data: User | null }>()
);

export const appUserDataLoaded = createAction(
  "[User] User App Data Loaded",
  props<{ data: AppUser | null }>()
);

export const createDefaultAppUserData = createAction(
  "[User] Create Default User App Data",
  props<{ data: AppUser|null }>()
);

export const defaultAppUserDataCreated = createAction(
  "[User] Default User App Data Loaded",
  props<{ data: AppUser }>()
);

export const editAppUserData = createAction(
  "[User] Edit user data",
   props<{ data: AppUser|null }>()
);

export const saveAppUserData = createAction(
  "[User] Upsert user data",
  props<{ data: AppUser|null }>()
);

export const saveAppUserDataSuccess = createAction(
  "[User] Upsert data",
  props<{ data: AppUser }>()
);

export const cancelEditAppUserData = createAction("[User] Cancel edit user data");

export const createAppUserAPIKey = createAction(
  "[User] Create API Key",
  (userId: string) => ({userId})
);

export const createAppUserAPIKeySuccess = createAction(
  "[User] API key success",
  props<{ data: AppUser }>()
);

export const databaseError = createAction(
  "[User] Database Error",
  props<{ error: any }>()
);