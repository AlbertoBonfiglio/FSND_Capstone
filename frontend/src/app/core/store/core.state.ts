import { UserState } from "./index";

export interface AppState {
  // ✨ New 👇
  auth: UserState;
}