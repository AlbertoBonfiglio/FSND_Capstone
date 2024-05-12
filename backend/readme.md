
# Table Of Content <!-- omit from toc -->

- [Getting Started](#getting-started)
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

## Getting Started

### Installing Dependencies

#### Python 3.9

Follow instructions to install the latest version of python for your platform in the [python docs](https://docs.python.org/3/using/unix.html#getting-and-installing-the-latest-version-of-python)

#### Virtual Environment

Aa virtual environment is recommended whenever using Python for projects. This keeps your dependencies for each project separate and organized. Instructions for setting up a virtual environment for your platform can be found in the [python docs](https://packaging.python.org/guides/installing-using-pip-and-virtual-environments/)

#### PIP Dependencies

All projects dependecncies can be installed by naviging to the `/backend` directory and running:

```bash
pip install -r requirements.txt
```

##### Key Dependencies

- [Flask](http://flask.pocoo.org/) is a lightweight backend microservices framework. Flask is required to handle requests and responses.

- [SQLAlchemy](https://www.sqlalchemy.org/) and [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/en/2.x/) are libraries to handle the database.

- [jose](https://python-jose.readthedocs.io/en/latest/) JavaScript Object Signing and Encryption for JWTs. Useful for encoding, decoding, and verifying JWTS.

- [python-dotenv](https://pypi.org/project/python-dotenv/) a package to help using environment variables

## Tasks

### Setup Auth0

1. Create a new Auth0 Account
2. Select a unique tenant domain
3. Create a new, single page web application
4. Create a new API
   - in API Settings:
     - Enable RBAC
     - Do not enable Add Permissions in the Access Token. Permissions and roles are handled by custom actions and added to the token directly
5. Create new API permissions:
   - `get:drinks`
  
6. Create new roles for:
   - Admin
     - can perform all actions on all users and can hard delete data fromthe database. This role is assigned manually in the Auth0 console.
   - User
     - can perform all actions on robots and data he or she owns. Attempting to alter data using another user id results in an 'Unauthorized' error. 
     - cannot hard delete data. Even if the hard flag is attached to the url query, the API will just soft delete the data by setting the status flag to 'deleted'. 
7. Test your endpoints with [Postman](https://getpostman.com).
   - Register 2 users - assign the Admin role to one and User role to the other. 
   - Auth0 needs to be configured with a default directory for the call to oauth/token to retrieve the access token to work
   - Import the postman collection `./backend/Tankrover.postman_collection.json`
   - Right-clicking the collection folder for admin and user, modify the admin token and user token to use the admin and user email and passwords to receive and store the auth token used in the scripts for testing.
   - Run the collection.
  
### Setup the Database

The database is a standard latest version postgresSQL rdbms istance.  
Install using instructions located [here](https://www.postgresql.org/download/)
Once installed, log in and create a database, and a user with read/write access to that database.
Make note of server address and port, database name, username and password as they will be needed when setting up the environment.

### Setup the environment

To run the backend several environment variables need to be properly configured:

1. `FLASK_APP`: "${workspaceFolder}/backend/api.py",
2. `FLASK_ENV`: `development` or `production`,
3. `CORS`: by deafault is set to `*` which accepts all connection origins. Should be changed to something more restrictive for production,
4. `APP_DB`: the database name. I.E.: `database.db` for development or production, `database.test.db` for unit tests,
5. `AUTH0_DOMAIN`: the Auth0 custom domain for the APP,
6. `AUTH0_CLIENTID`: the Clinet ID for the Auth0 APP,
7. `AUTH0_AUDIENCE`: the audience for the Auth0 API,
8. `AUTH0_ALGORITHMS`: "['RS256']",

These variables can either be configured manually from within the `./backend` directory by, for example, running in the terminal:

```bash
export FLASK_APP=backend/api/api.py;
export FLASK_ENV=development;
...
```

or more conveniently by setting the `.env` and `.env.test` files. Alternatively for VSCode users the variables could be set in the `env` section of the launch.json file

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
