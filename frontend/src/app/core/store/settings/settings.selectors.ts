import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SettingsState } from "./settings.state";

export const settingsFeatureKey = "Settings";
export const selectSettingsState = createFeatureSelector<SettingsState>(settingsFeatureKey);

export const selectSettings = createSelector(
  selectSettingsState,
  (state: SettingsState) => state
);

export const selectSettingsStickyHeader = createSelector(
  selectSettings,
  (state: SettingsState) => state.stickyHeader
);

export const selectSettingsLanguage = createSelector(
  selectSettings,
  (state: SettingsState) => state.language
);

export const selectTheme = createSelector(
  selectSettings,
  settings => settings.theme
);

export const selectPageAnimations = createSelector(
  selectSettings,
  settings => settings.pageAnimations
);

export const selectElementsAnimations = createSelector(
  selectSettings,
  settings => settings.elementsAnimations
);

export const selectAutoNightMode = createSelector(
  selectSettings,
  settings => settings.autoNightMode
);

export const selectNightTheme = createSelector(
  selectSettings,
  settings => settings.nightTheme
);

export const selectHour = createSelector(
  selectSettings,
  settings => settings.hour
);

export const selectIsNightHour = createSelector(
  selectAutoNightMode,
  selectHour,
  (autoNightMode, hour) => autoNightMode && (hour >= 21 || hour <= 7)
);

export const selectEffectiveTheme = createSelector(
  selectTheme,
  selectNightTheme,
  selectIsNightHour,
  (theme, nightTheme, isNightHour) =>
    (isNightHour ? nightTheme : theme).toLowerCase()
);

