# Tankrover API <!-- omit from toc -->

## Table Of Content <!-- omit from toc -->

- [Getting Started](#getting-started)
  - [Live site](#live-site)
  - [Installing Dependencies](#installing-dependencies)
    - [Python 3.9](#python-39)
    - [Virtual Environment](#virtual-environment)
    - [PIP Dependencies](#pip-dependencies)
      - [Key Dependencies](#key-dependencies)
- [Tasks](#tasks)
  - [Setup Auth0](#setup-auth0)
  - [Setup the Database](#setup-the-database)
  - [Setup the environment](#setup-the-environment)
  - [Running the server](#running-the-server)
- [Schema documentation](#schema-documentation)
- [Api Endpoint documentation](#api-endpoint-documentation)
- [Deployment to Render](#deployment-to-render)
  - [Steps](#steps)

## Getting Started

### Live site

A sample of the API can be accessed on [Render](https://fsnd-capstone-711w.onrender.com/status)

### Installing Dependencies

#### Python 3.9

Follow the instructions in [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python) to install the latest version of python for your platform

#### Virtual Environment

A virtual environment is recommended whenever using Python for projects. This keeps dependencies for each project separate and organized. Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

All projects dependecncies can be installed by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

##### Key Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) and [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) are libraries to handle the database.

- [jose](https://python-jose.readthedocs.io/en/latest/) JavaScript Object Signing and Encryption for JWTs. Useful for encoding, decoding, and verifying JWTS.

- [python-dotenv](https://pypi.org/project/python-dotenv/) reads key-value pairs from a .env file and can set them as environment variables.

## Tasks

### Setup Auth0

Setting up Auth0 to work with roles and permissions when accessing APIs with a Single Page Application is ridicolously hard. There is no automatic way to set a user role or grant permission at login without either granting roles and permissions manually in the dashboard, or using a custom action attached to the post login flow. Auth0 does not allow a SPA application to have a `grant:credentials` permission for security reasons and the Auth0 Management api fails in the action when it tries to grant a user a default role or permission. The work-around is to change the app type from `Single Page Application` to `regular web app` which can have the `grant:credentials` permission.

However, the library provided to manage the login and sign up flow in the frontend app doesn't work if the application type is set to `regular web app`.

To make all work, the `Authentication Extension` needs to be added and configured. This opens a new api that can be called inside the action and allows assigning custom roles and permisiions to the user profile. In the background it sets up another application and api that are used internally for the default role granting and to add roles and permission to the tokens. Additionally, it can be called externally, and the Python API uses it in the Admin endpoint to allow an admin to manage users in the front-end app.

The following are the steps to set up the Auth0 system

1. Create a new Auth0 Account
2. Select a unique tenant domain
3. Create a new `Single Page Application`. Make a note of the Client secret as it will be needed later. Finally, go to the Advanced settings section for the app and make sure the following grant types are enabled: `Implicit`, `Authorization Code`, `Refresh Token`, and `Password`. This will allow using an api call to retrieve a valid token for testing in Postman.
4. Create a new API
   - in API Settings:
     - Enable RBAC
     - Do not enable Add Permissions in the Access Token. Permissions and roles are handled by custom actions and added to the token directly
5. Create new API permissions:
   - `get:users`: gets all users (ADMIN ROLE ONLY)
   - `get:user`: gets a specific user
   - `get:robots`: gets a user's robots
   - `get:readings`: gets a user's robot readings
   - `patch:user`: Patches a user
   - `patch:robot`: Patches a user's robot
   - `post:user`: Posts a user
   - `post:robot`: Posts a robot for a user
   - `delete:user`: Deletes a user
   - `delete:robot`: Deletes a user robot
6. Navigate to the Extensions tabs and install Auth0 Authorization
   - detailed instructions on how to configure the extension can be found [here](https://auth0.com/docs/customize/extensions/authorization-extension) and [here](https://auth0.com/docs/api/authorization-extension?http#introduction). Do not forget to enable API Access.  
7. Once the extension is configured and the API access enabled,
   1. Create the same permissions as in step 5. Also create a `grant:role` permission.
   2. Create roles for:  
      - Admin
        - can perform all actions on all users and can hard delete data from the database. This role is assigned manually in the Auth0 console.
        - assign all permissions to this role.
      - User
        - can perform all actions on robots and data he or she owns. Attempting to alter data using another user id results in an 'Unauthorized' error.
        - cannot hard delete data. Even if the hard flag is attached to the url query, the API will just soft delete the data by setting the status flag to 'deleted'.
        - assign all permissions EXCEPT for `get:users` and `grant:role` to this role.
8. Navigate to the Actions tab in the Auth0 console and select Flows and then Login. Add a custom action and copy/paste the code from [action.js](../Auth0/actions.js). This will add a default user role to a user if none is assigned. It will also add the user roles and permissions to the authorization token returned when a user signs up. The action needs to be configured with the following secrets from the app created by the `Authorization extension`:
   - `domain`,
   - `clientId`,
   - `clientSecret`
   - `audience` and
   - `extensionUrl`.
Also, install the following packages `auth0@4.3.1`, `node-fetch@2.7.0`, and `axios@1.7.2`. MAke sure `node-fetch` stays at the version 2.x.x level due to incompatibility with javascript ES system when importing the module.
9. Test your endpoints with [Postman](https://getpostman.com).

   - Use the samples ones already configured in postman, or
   - Register 2 users and assign the Admin role to one and User role to the other.
   - Auth0 needs to be configured with a default directory for the call to oauth/token to retrieve the access token to work
   - Import the postman collection `./backend/Tankrover.postman_collection.json`
   - Right-clicking the collection folder for admin and user, modify the admin token and user token to use the admin and user email and passwords to receive and store the auth token used in the scripts for testing.
   - Run the collection.
   - Remember to clean up the database if you need to run the entire collection again.
  
### Setup the Database

The database is a standard latest version postgresSQL rdbms istance.  
Install using instructions located [here](https://www.postgresql.org/download/)
Once installed, log in and create a database, and a user with read/write access to that database.
Make note of server address and port, database name, username and password as they will be needed when setting up the environment.

### Setup the environment

To run the backend in development using flask several environment variables need to be properly configured:

1. `CORS`: by deafault is set to `*` which accepts all connection origins. Should be changed to something more restrictive for production,
2. `DATABASE_URI`: the database uniform resource locator. I.E.: `postgresql://tankrover:$twryedq63fd2fh@localhost:5438/tankrover`,
3. `TRACK_MODS`: Flask-SQLAlchemy can set up its session to track inserts, updates, and deletes for models, then send a Blinker signal with a list of these changes either before or during calls to session.flush() and session.commit(). It's expensive and better left to `FALSE`
4. `AUTH0_DOMAIN`: the Auth0 custom domain for the APP,
5. `AUTH0_AUDIENCE`: the audience for the Auth0 API,
6. `AUTH0_ALGORITHMS`: by default `RS256`,

To run the backend in development using flask a few additional environment variables need to be configured:

1. `FLASK_APP`: "${workspaceFolder}/backend/api.py",
2. `FLASK_ENV`: `development` or `production`,

These variables can either be configured manually from within the `./backend` directory by, for example, running in the terminal after changing the values appropriately:

```bash
./environment.sh
...
```

or more conveniently by setting the `.env` and `.env.test` files. Alternatively, for VSCode users, the variables could be set in the `env` section of the launch.json file

### Running the server

From within the `./backend` directory first ensure you are working using your created virtual environment. Usually something like this:
`source /home/<username>/<project>/.venv/bin/activate` should work.

Once the python environment and the required variables are set, to run the server, execute:

```bash
flask run --reload
```

The `--reload` flag will detect file changes and restart the server automatically.

## Schema documentation

The models and schema for the backend API are documented in the [readme_schema](./readme_schema.md) file.

## Api Endpoint documentation

The endpoints for the backend API are documented in the [README_API](./readme_api.md) file.

## Deployment to Render

Deploying to production involves 2 steps. [Render](https://dashboard.render.com/) is the hosting service chosen for the project but any other cloud provider would work.

### Steps

1. Sign up for a Render account at the link provided above.
2. Fork the [github project](https://github.com/AlbertoBonfiglio/FSND_Capstone)
3. Provision a postgreSQL instance on Render and take note of the public address. Keep this secret as it included the username and password to access the database.
4. Provision a web service
   1. Select build from repository
   2. Connect to the forked github repository
   3. Select a convenient region
   4. set /backend as the root directory
   5. set `gunicorn --bind=0.0.0.0:10000 -w 4 --timeout=7200 app:app` as the start command
   6. set `/status` as the health checlk path
   7. set all the environment variables (except the FLASK ones) with the appropriate values
5. Once provisioned the api can be tested using Postman. Remember to set the `url` variable to the correct API address (e.g.: `https://fsnd-capstone-711w.onrender.com`)
6. The project is also now set up in such a way that committing to the main branch or merging to the main branch will cause an automatic redeployment.
