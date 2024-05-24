import { Action, createReducer } from "@ngrx/store";
import { SettingsState, initialSettingsState,  } from "./settings.state";

export const settingsReducer = createReducer(
  initialSettingsState,
);

export function settingsReducerFn(state: SettingsState | undefined, action: Action) {
  return settingsReducer(state, action);
}