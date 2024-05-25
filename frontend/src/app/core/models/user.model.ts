import { Language, Status, Theme } from "../enums";

export class AppUser {
  id?: string;
  auth_id?: string;
  name?: string = 'Unknown User';
  email?: string;
  api_key?: string;
  preferences: UserPrefs = new UserPrefs()
  status: Status = Status.active; 
}

export class UserPrefs {
  theme: Theme = Theme.system;
  language: Language = Language.system;
}