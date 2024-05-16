# Backend - TankRover API <!-- omit from toc -->

The following provides detailed documentation of the backend API endpoints including the URL, request parameters, and the response body.

## Table of Content <!-- omit from toc -->

- [Status Endpoint](#status-endpoint)
  - [`GET '<HOST>/status'`](#get-hoststatus)
- [User Endpoints](#user-endpoints)
  - [`GET 'http[s]://<HOST>users'`](#get-httpshostusers)
  - [`GET 'http[s]://<HOST>users\<id>'`](#get-httpshostusersid)
  - [`POST 'http[s]://<HOST>users'`](#post-httpshostusers)
  - [`PATCH 'http[s]://<HOST>users/<id>'`](#patch-httpshostusersid)
  - [`PATCH 'http[s]://<HOST>users/<id>/changeApiKey'`](#patch-httpshostusersidchangeapikey)
  - [`DELETE 'http[s]://<HOST>users/<id>'`](#delete-httpshostusersid)
- [Robots Endpoints](#robots-endpoints)
  - [`GET 'http[s]://<HOST>robot'`](#get-httpshostrobot)
- [IOT Endpoints](#iot-endpoints)
  - [`GET 'http[s]://<HOST>/iot/<string:MAC>/getRobotSettings'`](#get-httpshostiotstringmacgetrobotsettings)
  - [`POST 'http[s]://<HOST>/iot/<string:MAC>/postSensorReadings'`](#post-httpshostiotstringmacpostsensorreadings)

### Status Endpoint

#### `GET '<HOST>/status'`

### User Endpoints

- Queries the system to ensure it's operational
- Request Arguments: None
- Usage example: `http[s]://<HOST>/status`
- Returns: A status of 200 and a json payload of 'ready' if operational.

#### `GET 'http[s]://<HOST>users'`

- Fetches an array of Users objects with a status of `active`
- Request Arguments: None
- Query Arguments:
  - `activeOnly`: a boolean that if set to `false` expands the query to include user with any status
  - `expanded`: a boolean that if set to `true` returns the list of robots for each user instead of a count  
- Usage example: `http[s]://<host>users`
- Returns: A JSON object with a key, `data`, containg an array of user objects, a `count` containing the number of user retrieved, and a `success` boolean key.
- Permissions: Requires a role of `admin` and a permission of `get:users`
- example:  
  
  ```json
  {
    "count": 2,
    "data": [
      {
        "api_key": "Pism_XIAdU7L7zECR7uJ_g",
        "auth_id": "auth0|xxxyy",
        "email": "name@domain.com",
        "id": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
        "name": "Beardo",
        "preferences": {
            "complaining": false,
            "dancing": [
                "2 left feet",
                "limpada"
            ]
        },
        "robots": 1,
        "status": "active"
      },
      ...
      ],
      "success": true
  }
  ```

#### `GET 'http[s]://<HOST>users\<id>'`

- Fetches the user object for the passed id
- Request Arguments: `id:string` the uuid of the user
- Query Arguments:
  - `expanded`: a boolean that if set to `true` returns the list of robots for each user instead of a count  
- Usage example: `http[s]://<host>users/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Returns: A JSON object with a key, `data`, containg the user object, and a `success` boolean key.
- Permissions: Requires a role of `admin` or `user` and a permission of `get:user`. If the role is `user` the API compares the id passed to the id of the logged in user. If not matching returns an Unautorized 401 error.
  
```json
{
  "data": {
      "api_key": "Pism_XIAdU7L7zECR7uJ_g",
      "auth_id": "auth0|xxxyy",
      "email": "name@domain.com",
      "id": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
      "name": "Beardo",
      "preferences": {
          "complaining": false,
          "dancing": [
              "2 left feet",
              "limpada"
          ]
      },
      "robots": 1,
      "status": "active"
    },
    "success": true
}
```

#### `POST 'http[s]://<HOST>users'`

- Posts the user object from the payload
- Request Arguments: None
- Query Arguments: None  
- Usage example: `http[s]://<host>users`
- Payload: a json object containing the following-key value pairs:
  
  ```json
    {   
      "auth_id": "auth0|6639fe49ba5b6aa80cd41f1a",
      "email": "pparker@daily-bugle.com",
      "name": "Peter Benjamin Parker",
      "preferences": {
        "theme": "system",
        "language": "en-us"
      },
      "status": "active"
    }
  ```

- Returns: A JSON object with a key, `data`, containg the inserted user object, and a `success` boolean key. Email and auth_id must be valid and unique or the system will return a 409 or 422 errors
- Permissions: Requires a role of `admin` or `user` and a permission of `post:user`. If the role is `user` the API compares the auth_id passed to the auth_id of the logged in user. If not matching returns an Unautorized 401 error.
  
```json
{
  "data": {
      "id": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
      "auth_id": "auth0|6639fe49ba5b6aa80cd41f1a",
      "email": "pparker@daily-bugle.com",
      "name": "Peter Benjamin Parker",
      "preferences": {
        "theme": "system",
        "language": "en-us"
      },
      "api_key": "Pism_XIAdU7L7zECR7uJ_g",
      "robots": 1,
      "status": "active"
    },
    "success": true
}
```

#### `PATCH 'http[s]://<HOST>users/<id>'`

- Patches the user object for the passed id with the valuse in the payload
- Request Arguments: `id:string` the uuid of the user
- Query Arguments: None  
- Usage example: `http[s]://<host>users/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Payload: a json object containing any of the following-key value pairs:
  
  ```json
    {   
      "email": "pparker@daily-bugle.com",
      "name": "Peter Benjamin Parker",
      "preferences": {
        "theme": "system",
        "language": "en-us"
      },
      "status": "active"
    }
  ```

- Returns: A JSON object with a key, `data`, containg the inserted user object, and a `success` boolean key. Email must be valid and unique or the system will return a 409 or 422 errors
- Permissions: Requires a role of `admin` or `user` and a permission of `patch:user`. If the role is `user` the API compares the auth_id passed to the auth_id of the logged in user. If not matching returns an Unautorized 401 error.
  
```json
{
  "data": {
      "id": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
      "auth_id": "auth0|6639fe49ba5b6aa80cd41f1a",
      "email": "pparker@daily-bugle.com",
      "name": "Peter Benjamin Parker",
      "preferences": {
        "theme": "system",
        "language": "en-us"
      },
      "api_key": "Pism_XIAdU7L7zECR7uJ_g",
      "robots": 1,
      "status": "active"
    },
    "success": true
}
```

#### `PATCH 'http[s]://<HOST>users/<id>/changeApiKey'`

- Changes the user object api key for the passed id with a self generated one
- Request Arguments: `id:string` the uuid of the user
- Query Arguments: None  
- Usage example: `http[s]://<host>users/8f6df43a-8699-4cca-97f4-d0f66dc49291/changeApiKey`
- Returns: A JSON object with a key, `data`, containg the user object with the new api_key, and a `success` boolean key.
- Permissions: Requires a role of `admin` or `user` and a permission of `patch:user`. If the role is `user` the API compares the auth_id passed to the auth_id of the logged in user. If not matching returns an Unautorized 401 error.
  
```json
{
  "data": {
      "id": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
      "auth_id": "auth0|6639fe49ba5b6aa80cd41f1a",
      "email": "pparker@daily-bugle.com",
      "name": "Peter Benjamin Parker",
      "preferences": {
        "theme": "system",
        "language": "en-us"
      },
      "api_key": "dL6XibXf0e_ug8olVaFUdA",
      "robots": 1,
      "status": "active"
    },
    "success": true
}
```

#### `DELETE 'http[s]://<HOST>users/<id>'`

- Deletes the user object for the passed id with the valuse in the payload
- Request Arguments: `id:string` the uuid of the user
- Query Arguments: `hard` (default false) if set to true and the user role is `admin` performs a hard data delete with cascade on the user wich includes all robots and readings data.
- Usage example: `http[s]://<host>users/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Returns: A JSON object with a key, `data`, containg the delete user object id, and a `success` boolean key.
- Permissions: Requires a role of `admin` or `user` and a permission of `delete:user`. If the role is `user` the API compares the id passed to the id of the logged in user. If not matching returns an Unautorized 401 error. Additionally, if the user role is `user` the flag is disregarded and a soft delete is performed (user status is set to `deleted`)
  
```json
{
  "data": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
  "success": true
}
```

---

### Robots Endpoints

#### `GET 'http[s]://<HOST>robot'`

- Fetches an array of Users objects
- Request Arguments: None
- Usage example: `http[s]://<host>users`
- Returns: A JSON object with a key, `data`, that contains an array of objects with  `id: key, type: string` attributes, and a `success` boolean key.

```json
{
    "data": [
        {   "id": 1, "type": "Science" },
        {   "id": 2, "type": "Art" },
        {   "id": 3, "type": "Geography" },
        {   "id": 4, "type": "History" },
        {   "id": 5, "type": "Entertainment" },
        {   "id": 6, "type": "Sports" }
    ],
    "success": true
}
```

---

### IOT Endpoints

The `iot` endpoints are used by the robots to post readings and retrieve configuration parameters. They are secured by an `API KEY` generated randomly for each user that is passed in the request header `XApplicationKey`.

#### `GET 'http[s]://<HOST>/iot/<string:MAC>/getRobotSettings'`

- Fetches the preferences object of the robot with the passed MAC address
- Request Arguments: None
- Usage example: `http[s]://<host>/iot/9C-B6-D0-3E-9A-BA/getRobotSettings`
- Returns: A JSON object with a key, `data` containing an array of json objects, and a `success` boolean key.
  
  ```json
  {
      "data": [
          {   "roaming_frequency": 500 },
          {   "roaming_distance": 5 },
          ...
      ],
      "success": true
  }
  ```

- If the api_key and the robot  whose mac address is used do not belong to the same user a 404 error is returned.
- If the api_key is not found a 401 error is returned

#### `POST 'http[s]://<HOST>/iot/<string:MAC>/postSensorReadings'`

- Posts the sensor readings of the robot with the passed MAC address
- Request Arguments: `MAC` the mac address of the robot
- Payload: a JSON object with a `data` key containing a JSON Tuple array, and an optional `date` datetime value
  
  ```json
  {
    "data": [
        {"temperature": 27.5},
        {"coltage": 3.7}
    ],
    "date": "2024-02-19 01:13:54+00"
  }
  ```

- Usage example: `http[s]://iot/9C-B6-D0-3E-9A-BC/postSensorReadings`
- Returns: A JSON object with a `success` boolean key.

  ```json
  {
      "success": true
  }
  ```

- If the api_key and the robot  whose mac address is used do not belong to the same user a 404 error is returned.
- If the api_key is not found a 401 error is returned
