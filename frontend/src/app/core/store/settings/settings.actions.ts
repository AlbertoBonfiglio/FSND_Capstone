import { createAction, props } from "@ngrx/store";
import { Theme } from "../../enums";

export const allSettingsActions = {
  setTheme: createAction("Set theme"),
};

export const themeChanged = createAction(
  "[APP] Theme Changed",
  props<{ theme: Theme }>()
);
