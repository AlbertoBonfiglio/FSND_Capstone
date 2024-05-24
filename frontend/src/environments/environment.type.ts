export interface IEnvironment {
  production: boolean;
  appTitle: string
  apiUri: string;
  auth: {
    clientId: string;
    clientSecret: string;
    domain: string,
    audience: string,
  },
  splashDelay: number
}