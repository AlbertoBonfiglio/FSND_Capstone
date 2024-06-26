import { User as Auth0User } from "@auth0/auth0-spa-js";

export interface AuthState {
  user: Auth0User | null;
}

export const initialAuthState: AuthState = {
  user: null
};