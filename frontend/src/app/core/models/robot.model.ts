import { Status } from "../enums";
import { getRandomIntInclusive } from "../utils";
import { Preference } from "./preferences.model";
import { Reading } from "./reading.model";


export class AppRobot {
  id?: string;
  user_id?: string;
  mac?: string;
  name?: string;
  description: string = '';
  preferences: Preference[] = [];
  readings: Reading[] |number = 0;
  status: Status = Status.active; 

  constructor(
    id: string = '', user_id: string = '', mac: string = '',
    name: string = '', description: string = '',
    preferences: Preference[] = [],
    readings: Reading[] |number = 0,
    status: Status = Status.active, 
  ) {
    this.id = id;
    this.user_id = user_id;
    this.mac = mac;
    this.name = name;
    this.description = description;
    this.preferences = this.initPrefs(preferences);
    this.readings = readings;
    this.status = status;  
  }
  
  private initPrefs(prefs: Preference[]): Preference[]{
    // Sets default values for the robot
    if (prefs && prefs.length > 1) {
      return prefs;
    }
    let value = [];
    value.push(new Preference('avatar', this.defaultAvatar(), true)); // if required cannot be deleted
    value.push(new Preference('roamingRange', 5));
    value.push(new Preference('roamingInterval', 5000));
    return value;
  }

  private defaultAvatar(): string {
    const num =  getRandomIntInclusive(1,8);  
    return  `00${num}-robot.png`; 
  }

  static RobotFactory(user_id:string, name: string, mac:string ) {
    let bot = new AppRobot();
    bot.user_id = user_id;
    bot.name = name;
    bot.mac = mac;
    return bot;
  }

  static fromJson(json:string) {
    return new AppRobot();
  }
}
