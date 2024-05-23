import { createFeatureSelector, createSelector } from "@ngrx/store";
import { environment } from "../../../../environments/environment"
import { UserState } from "./user.state";

export const authFeaureKey = "Auth";
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user"
};

export const selectUser = createFeatureSelector<UserState>(authFeaureKey);

export const selectAuthUser = createSelector(
  selectUser,
  (state: UserState) => state?.user
);

export const selectIsLoggedIn = createSelector(
  selectAuthUser,
  (user) => !!user
);

export const selectUserRoles = createSelector(
  selectAuthUser,
  (user) => user![`${environment.auth.audience}/roles`] ?? []
);


export const selectIsAdmin = createSelector(selectUserRoles, (userRoles) =>
  userRoles?.includes(USER_ROLES.ADMIN)
);