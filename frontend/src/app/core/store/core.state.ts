import { AuthState, RobotState, UserState } from "./index";
import { SettingsState } from "./settings/settings.state";

export interface AppState {
  auth: AuthState;
  user: UserState;
  settings: SettingsState;

  robots: RobotState;
}


// https://github.com/ngrx/platform/blob/master/projects/example-app/src/app/books/effects/book.effects.ts#L49-L55