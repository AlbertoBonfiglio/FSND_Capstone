import { IEnvironment } from "./environment.type";

export const environment: IEnvironment = {
  production: false,
  appTitle: "Bonfibots!",
  apiUri: 'http://localhost:5002',
  auth: {
    clientId: 'iQAVMWxA8pqv0LRikpzGbLg04WIKHg6u',
    clientSecret: '1qJoRZvJftg3zH691V4rJTY1WIDXqt6w7idq6I8nGGvLgg4O-oNgUi32UMNiBbQ_',
    domain: 'darthbert-udacity.au.auth0.com',
    audience: 'tankrover_api'
  },
  splashDelay: 1500
};
