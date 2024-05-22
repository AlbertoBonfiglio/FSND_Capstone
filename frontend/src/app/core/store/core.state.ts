import { UserState } from "./index";

export interface State {
  //menus: MenusState;
  // ✨ New 👇
  Auth: UserState;
}