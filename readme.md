# TankRover<!-- omit from toc -->

An app to monitor and manage robots monitoring environmental parameters for lizard tanks

## Table Of Content <!-- omit from toc -->

- [Overview](#overview)
- [Authentication](#authentication)
  - [Permissions](#permissions)
    - [tankrover\_admin](#tankrover_admin)
    - [tankrover\_user](#tankrover_user)

## Overview

The backend is a python flask API connecting to a postgresql backend via sqlalchemy

THe frontend is an angular PWA hosted on render
Each is documentted in a readme file hosted in the appropriate folder

1. [`API`](./backend/README.md)
2. [`PWA`](./frontend/README.md)

## Authentication

Per requirement Auth0 should be the auth provider.
We also want to secure the api with Firebase AppCheck to make sure only authorized apps can access the api so we'll integrate Auth0 into the Firebase Authentication flow.
A sample on how to achieve this can be found [here](https://auth0.com/blog/developing-real-time-apps-with-firebase-and-firestore/)

### Permissions

#### tankrover_admin

- get:all: Can get all data (admin role)
- post:all: Can post for all users (admin role)
- patch:all: Can patch all data (admin role)
- delete:all: Can delete all data (admin role)

#### tankrover_user

- get:single: Can only get owned data
- post:single: Can only post own data
- patch:single: Can only patch own data
- delete:single: Can only delete own data
