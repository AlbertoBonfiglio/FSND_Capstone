import { Theme } from "../../enums";


export interface SettingsState {
  theme: Theme;
}

export const initialSettingsState: SettingsState = {
  theme: Theme.system
};