import { createFeatureSelector, createSelector } from "@ngrx/store";
import { RobotState } from "./robot.state";
import { AppRobot } from "../../models/robot.model";

export const robotFeatureKey = "Robot";

export const selectRobotState = createFeatureSelector<RobotState>(robotFeatureKey);

export const selectedRobot = createSelector(
  selectRobotState,
  (state: RobotState) => state?.selected
);


export const selectedRobotId = () =>  createSelector(
  selectedRobot,
  (bot: AppRobot|null) => bot?.id
);
