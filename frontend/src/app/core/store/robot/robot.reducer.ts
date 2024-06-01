import { Action, createReducer, on } from "@ngrx/store";
import { RobotState, initialRobotState } from "./robot.state";
import { setSelectedRobot } from "./robot.actions";

export const robotReducer = createReducer(
  initialRobotState,
  
  on(setSelectedRobot, (state, { data }) => ({
    ...state,
    selected: data,
  })),


);

export function robotReducerFn(state: RobotState | undefined, action: Action) {
  return robotReducer(state, action);
}