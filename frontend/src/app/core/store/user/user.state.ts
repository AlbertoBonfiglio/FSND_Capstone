import { AppRobot } from "../../models/robot.model";
import { AppUser } from "../../models/user.model";

export interface UserState {
  appUser: AppUser | null;
}

export const initialUserState: UserState = {
  appUser: null
};