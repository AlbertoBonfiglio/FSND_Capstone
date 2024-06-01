import { createFeatureSelector, createSelector } from "@ngrx/store";
import { UserState } from "./user.state";

export const userFeatureKey = "User";

export const selectUserState = createFeatureSelector<UserState>(userFeatureKey);

export const selectUser = createSelector(
  selectUserState,
  (state: UserState) => state?.appUser
);


export const selectAppUserId = createSelector(
  selectUser,
  (user) => user?.id
);

export const selectAppUserRobots = createSelector(
  selectUser,
  (user) => (user) 
    ? (Array.isArray(user?.robots)) 
      ? user.robots
      : []
    : []
);

export const selectAppUserRobotsCount = createSelector(
  selectUser,
  (user) => (user) 
    ? (Array.isArray(user?.robots)) 
      ? user.robots.length
      : user.robots
    : 0
);
