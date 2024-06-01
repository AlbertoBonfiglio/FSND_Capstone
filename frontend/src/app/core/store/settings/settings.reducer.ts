import { Action, createReducer, on } from "@ngrx/store";
import { SettingsState, initialSettingsState,  } from "./settings.state";
import { actionSettingsChangeAnimationsElements, actionSettingsChangeAnimationsPage, 
  actionSettingsChangeAnimationsPageDisabled, actionSettingsChangeAnnouncement, 
  actionSettingsChangeAutoNightMode, actionSettingsChangeHour, 
  actionSettingsChangeLanguage, actionSettingsChangeStickyHeader, 
  actionSettingsChangeTheme } from "./settings.actions";


const settingsReducer = createReducer(
  initialSettingsState,
  on(
    actionSettingsChangeLanguage,
    actionSettingsChangeTheme,
    actionSettingsChangeAutoNightMode,
    actionSettingsChangeStickyHeader,
    actionSettingsChangeAnimationsPage,
    actionSettingsChangeAnimationsElements,
    actionSettingsChangeHour,
    actionSettingsChangeAnnouncement,
    (state, action) => ({ ...state, ...action })
  ),
  on(
    actionSettingsChangeAnimationsPageDisabled,
    (state, { pageAnimationsDisabled }) => ({
      ...state,
      pageAnimationsDisabled,
      pageAnimations: false
    })
  )
);


export function settingsReducerFn(state: SettingsState | undefined, action: Action) {
  return settingsReducer(state, action);
}