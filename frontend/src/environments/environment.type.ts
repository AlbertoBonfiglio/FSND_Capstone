export interface IEnvironment {
  production: boolean;
  apiUri: string;
  auth: {
    clientId: string;
    clientSecret: string;
    domain: string,
    audience: string,
  }
}