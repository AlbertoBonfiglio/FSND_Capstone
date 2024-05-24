import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettingsState } from "./settings.state";

export const settingsFeatureKey = "Settings";
export const selectSettings = createFeatureSelector<SettingsState>(settingsFeatureKey);

export const selectTheme = createSelector(
  selectSettings,
  (state: SettingsState) => state?.theme
);
