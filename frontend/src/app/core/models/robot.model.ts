import { Status } from "../enums";
import { Reading } from "./reading.model";

export class AppRobot {
  id?: string;
  user_id?: string;
  mac?: string;
  name?: string;
  description: string = '';
  preferences: any = {};
  readings: Reading[] |number = 0;
  status: Status = Status.active; 
}