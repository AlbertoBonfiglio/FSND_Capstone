import { createFeatureSelector, createSelector } from "@ngrx/store";
import { environment } from "../../../../environments/environment"
import { AuthState } from "./user.state";

export const authFeatureKey = "Auth";
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
};

export const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);

export const selectAuthUser = createSelector(
  selectAuthState,
  (state: AuthState) => state?.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthUser,
  (user) => !!user
);

export const selectUserRoles = createSelector(
  selectAuthUser,
  (user:any) => user!.user_profile.roles ?? []
);

export const selectUserPermissions = createSelector(
  selectAuthUser,
  (user:any) => user!.user_profile.permissions ?? []
);



export const selectIsAdmin = createSelector(selectUserRoles, (userRoles) =>
  userRoles?.includes(USER_ROLES.ADMIN)
);