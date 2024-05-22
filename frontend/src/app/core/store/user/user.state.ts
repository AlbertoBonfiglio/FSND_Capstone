import { User as Auth0User } from "@auth0/auth0-spa-js";

export interface UserState {
  user: Auth0User|null|undefined;
}

export const initialState: UserState = {
  user: null,
};