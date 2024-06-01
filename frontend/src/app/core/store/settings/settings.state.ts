import { Theme } from "../../enums";
import { environment as env } from '../../../../environments/environment';
export const NIGHT_MODE_THEME = Theme.dark;

export type Language = 'en-us' | 'fr' | 'es';

export interface SettingsState {
  language: string;
  theme: Theme;
  autoNightMode: boolean;
  nightTheme: string;
  stickyHeader: boolean;
  pageAnimations: boolean;
  pageAnimationsDisabled: boolean;
  elementsAnimations: boolean;
  hour: number;
}

export const initialSettingsState: SettingsState = {
  language: 'en',
  theme: Theme.system,
  autoNightMode: false,
  nightTheme: NIGHT_MODE_THEME,
  stickyHeader: true,
  pageAnimations: true,
  pageAnimationsDisabled: false,
  elementsAnimations: true,
  hour: 0,
};