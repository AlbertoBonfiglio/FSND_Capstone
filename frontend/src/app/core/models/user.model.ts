import { Theme } from "../store";

export class AppUser {
  id?: string;
  auth_id?: string;
  name?: string = 'Unknown User';
  email?: string;
  api_key?: string;
  preferences: any = {
    theme: Theme.system
  }
}