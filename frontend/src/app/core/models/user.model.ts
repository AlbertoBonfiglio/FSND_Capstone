import { Language, Status, Theme } from "../enums";
import { Preference } from "./preferences.model";
import { AppRobot } from "./robot.model";

export class AppUser {
  id: string = '';
  auth_id: string  = '';
  name: string = 'Unknown User';
  email: string  = '';
  api_key: string  = '';
  preferences: Preference[] = []
  robots: AppRobot[] | number = 0
  status: Status = Status.active; 

  constructor(
    id: string = '', 
    auth_id:string = '', 
    name: string = '', 
    email:string = '', 
    prefs: Preference[] = [], 
    api_key: string  = '', 
    robots: AppRobot[] | number = 0,
    status: Status = Status.active, 
  ){
    this.id = id
    this.auth_id = auth_id
    this.name = name;
    this.email = email;
    this.api_key= api_key;
    this.preferences = this.initPrefs( prefs );
    this.status = status;
    this.robots = robots;
  }

  private initPrefs (prefs: Preference[]): Preference[] {
    if (prefs.length > 2) { 
      return prefs;
    }
    let value = [];
    value.push(new Preference('theme', Theme.system, true)); // if required cannot be deleted
    value.push(new Preference('language', Language.system, true)); 
    return value;
  } 

  static UserFactory(auth_id:string, name: string, email:string ) {
    return new AppUser(auth_id, name, email);
  }

  static romJson(json:string ): AppUser {
    throw new Error("Not Implemented yet");
  }
}
