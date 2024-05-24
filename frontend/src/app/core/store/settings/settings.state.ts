import { User as Auth0User } from "@auth0/auth0-spa-js";

export enum Theme {
  system = 'system',
  dark = "dark",
  light = "light"
}
export interface SettingsState {
  theme: Theme;
}

export const initialSettingsState: SettingsState = {
  theme: Theme.system
};