import { createAction, props } from "@ngrx/store";
import { AppRobot } from "../../models/robot.model";

export const addUserRobot = createAction("[Robot] Add User Robots" );
export const editUserRobot = createAction("[Robot] Edit User Robots", props<{ robot: AppRobot}>() );
export const cancelEditRobot = createAction("[Robot] Cancel edit");
export const deleteUserRobot = createAction("[Robot] Delete User Robots", props<{ robot: AppRobot}>() );
export const saveUserRobot = createAction("[Robot] Save User Robot Success", props<{ robot: AppRobot}>() );
export const saveUserRobotSuccess = createAction("[Robot] Save User Robot Success", props<{ robot: AppRobot}>() );
export const saveUserRobotFailure = createAction("[Robot] Save User Robot success", props<{ robot: AppRobot}>() );


export const setSelectedRobot = createAction(
  "[Robot] Set selected robot",
  props<{ data: AppRobot|null }>()
);