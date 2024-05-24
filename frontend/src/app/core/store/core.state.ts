import { AuthState } from "./index";
import { SettingsState } from "./settings/settings.state";

export interface AppState {
  auth: AuthState;
  settings: SettingsState;
}