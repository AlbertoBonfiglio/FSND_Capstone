# TankRover<!-- omit from toc -->

This project is the capstone for the Full Stack Developer Micromaster degree from Udacity.
The goal of the project is to have a reliable and open-source app to monitor and manage small Arduino (but not limited to Arduino alone) robots monitoring environmental parameters for reptile terrariums.

## Table Of Content <!-- omit from toc -->

- [Overview](#overview)
- [License](#license)
- [Authentication](#authentication)

## Overview

The project is split in a front-end angular Progressive Web App (PWA) and a backend API written in Python connecting to a postgresql backend via sqlalchemy

Each is documentted in a readme file hosted in the appropriate folder

1. [`API`](./backend/readme.md)
2. [`PWA`](./frontend/README.md)

## License

The project is licensed under the GNU General Public Llicence. It can be found [here](./LICENSE)

## Authentication

Per requirement Auth0 should be the auth provider.
We also want to secure the api with Firebase AppCheck to make sure only authorized apps can access the api so we'll integrate Auth0 into the Firebase Authentication flow.
A sample on how to achieve this can be found [here](https://auth0.com/blog/developing-real-time-apps-with-firebase-and-firestore/)
