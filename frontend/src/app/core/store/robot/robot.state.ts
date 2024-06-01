import { AppRobot } from "../../models/robot.model";

export interface RobotState {
  selected: AppRobot|null,
}

export const initialRobotState: RobotState = {
  selected: null,
};