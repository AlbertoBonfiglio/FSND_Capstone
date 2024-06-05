import { Language, Status, Theme } from "../enums";
import { AppRobot } from "./robot.model";

export class AppUser {
  id: string = '';
  auth_id: string  = '';
  name: string = 'Unknown User';
  email: string  = '';
  api_key: string  = '';
  preferences: AppUserPrefs = new AppUserPrefs()
  robots: AppRobot[] | number = 0
  status: Status = Status.active; 

  constructor(auth_id:string, name: string, email:string ){
    this.auth_id = auth_id
    this.name = name;
    this.email = email;
  }

  static UserFactory(auth_id:string, name: string, email:string ) {
    return new AppUser(auth_id, name, email);

  }
}

export class AppUserPrefs {
  theme: Theme = Theme.system;
  language: Language = Language.system;
}