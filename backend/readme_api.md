# Backend - TankRover API <!-- omit from toc -->

The following provides detailed documentation of the backend API endpoints including the URL, request parameters, and the response body.

## Table of Content <!-- omit from toc -->

- [Status Endpoint](#status-endpoint)
  - [`GET '<HOST>/status'`](#get-hoststatus)
- [User Endpoints](#user-endpoints)
  - [`GET 'http[s]://<HOST>users'`](#get-httpshostusers)
  - [`GET 'http[s]://<HOST>users/<id>'`](#get-httpshostusersid)
  - [`GET 'http[s]://<HOST>users/auth/<id>'`](#get-httpshostusersauthid)
  - [`POST 'http[s]://<HOST>users'`](#post-httpshostusers)
  - [`PATCH 'http[s]://<HOST>users/<id>'`](#patch-httpshostusersid)
  - [`PATCH 'http[s]://<HOST>users/<id>/changeApiKey'`](#patch-httpshostusersidchangeapikey)
  - [`DELETE 'http[s]://<HOST>users/<id>'`](#delete-httpshostusersid)
- [Robots Endpoints](#robots-endpoints)
  - [`GET 'http[s]://<HOST>robot/<id>'`](#get-httpshostrobotid)
  - [`POST 'http[s]://<HOST>robots'`](#post-httpshostrobots)
  - [`PATCH 'http[s]://<HOST>robots/<id>'`](#patch-httpshostrobotsid)
  - [`DELETE 'http[s]://<HOST>robots/<id>'`](#delete-httpshostrobotsid)
  - [`GET 'http[s]://<HOST>robots/<id>/readings'`](#get-httpshostrobotsidreadings)
- [IOT Endpoints](#iot-endpoints)
  - [`GET 'http[s]://<HOST>/iot/<string:MAC>/getRobotSettings'`](#get-httpshostiotstringmacgetrobotsettings)
  - [`POST 'http[s]://<HOST>/iot/<string:MAC>/postSensorReadings'`](#post-httpshostiotstringmacpostsensorreadings)

### Status Endpoint

#### `GET '<HOST>/status'`

### User Endpoints

- Queries the system to ensure it's operational
- Request Arguments: None
- Usage example: `http[s]://<HOST>/status`
- Returns: A status of 200 and a json payload with service status and version number
  
  ```json
    {
      "status": "healthy",
      "version": "1.0.1"
    }
  ```

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

#### `GET 'http[s]://<HOST>users/<id>'`

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

#### `GET 'http[s]://<HOST>users/auth/<id>'`

- Fetches the user object for the passed Auth0 id
- Request Arguments: `id:string` the Auth0 issued id  of the user
- Query Arguments:
  - `expanded`: a boolean that if set to `true` returns the list of robots for each user instead of a count  
- Usage example: `http[s]://<host>users/auth/auth0|xxxyyd0f66dc49291`
- Returns: A JSON object with a key, `data`, containg the user object, and a `success` boolean key.
- Permissions: Requires a role of `admin` or `user` and a permission of `get:user`. If the role is `user` the API compares the id passed to the id of the logged in user. If not matching returns an Unautorized 401 error.
  
```json
{
  "data": {
      "api_key": "Pism_XIAdU7L7zECR7uJ_g",
      "auth_id": "auth0|xxxyyd0f66dc49291",
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

- Deletes the user object for the passed id
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

#### `GET 'http[s]://<HOST>robot/<id>'`

- Fetches the robot object for the passed id
- Request Arguments: `id:string` the uuid of the robot
- Query Arguments: None
- Usage example: `http[s]://<host>robots/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Returns: A JSON object with a key, `data`, containg the robot object, and a `success` boolean key. The object has a read only key containing the number of `readings` recorded for the robot

  ```json
  {
      "data": {
          "description": "Small arduino tank rover",
          "id": "73a7a3fd-c11c-4e61-b966-09ab32c79acf",
          "mac": "9C-B6-D0-3E-9A-BA",
          "name": "Robot 1",
          "preferences": {
              "roamingDistance": 3,
              "roamingFrequency": 5
          },
          "readings": 1026,
          "status": "active",
          "user_id": "b0e7be71-1a9b-4943-a402-f8f8f1f5f10c"
      },
      "success": true
  }
  ```

- Permissions: Requires a role of `admin` or `user` and a permission of `get:robot`. If the role is `user` the API compares the id of the robot's owner to the id of the logged in user. If not matching returns an Unautorized 401 error.

#### `POST 'http[s]://<HOST>robots'`

- Posts the robot object from the payload
- Request Arguments: None
- Query Arguments: None  
- Usage example: `http[s]://<host>robots`
- Payload: a json object containing the following-key value pairs:
  
  ```json
    {
      "description": "Small arduino tank rover",
      "mac": "9C-B6-D0-3E-9A-BA",
      "name": "Robot 1",
      "preferences": {
          "roamingDistance": 3,
          "roamingFrequency": 5
      },
      "status": "active",
      "user_id": "b0e7be71-1a9b-4943-a402-f8f8f1f5f10c"
  }
  ```

  `description` and `preferences` are optional.
- Returns: A JSON object with a key, `data`, containg the inserted robot object, and a `success` boolean key. The `mac` and `user_id_`  must be valid and unique or the system will return either 409 or 422 errors
  
  ```json
  {
    "data": {
        "description": "Small arduino tank rover",
        "id": "73a7a3fd-c11c-4e61-b966-09ab32c79acf",
        "mac": "9C-B6-D0-3E-9A-BA",
        "name": "Robot 1",
        "preferences": {
            "roamingDistance": 3,
            "roamingFrequency": 5
        },
        "readings": 1026,
        "status": "active",
        "user_id": "b0e7be71-1a9b-4943-a402-f8f8f1f5f10c"
    },
    "success": true
  }
  ```

- Permissions: Requires a role of `admin` or `user` and a permission of `post:robot`. If the role is `user` the API compares the user_id passed to the auth_id of the logged in user. If not matching returns an Unautorized 401 error.

---

#### `PATCH 'http[s]://<HOST>robots/<id>'`

- Patches the robot object for the passed id with the values in the payload
- Request Arguments: `id:string` the uuid of the robot
- Query Arguments: None  
- Usage example: `http[s]://<host>robots/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Payload: a json object containing any of the following-key value pairs:
  
  ```json
  {
    "description": "Small arduino tank rover",
    "mac": "9C-B6-D0-3E-9A-BA",
    "name": "Robot 1",
    "preferences": {
        "roamingDistance": 3,
        "roamingFrequency": 5
    },
    "status": "active",
  }
  ```

- Returns: A JSON object with a key, `data`, containg the patched object, and a `success` boolean key. The `mac` must be valid and unique or the system will return a 409 or 422 errors
  
 ```json
  {
    "data": {
        "description": "Small arduino tank rover",
        "id": "73a7a3fd-c11c-4e61-b966-09ab32c79acf",
        "mac": "9C-B6-D0-3E-9A-BA",
        "name": "Robot 1",
        "preferences": {
            "roamingDistance": 3,
            "roamingFrequency": 5
        },
        "readings": 1026,
        "status": "active",
        "user_id": "b0e7be71-1a9b-4943-a402-f8f8f1f5f10c"
    },
    "success": true
  }
  ```

- Permissions: Requires a role of `admin` or `user` and a permission of `patch:robot`. If the role is `user` the API compares the auth_id of the robot's owner to the auth_id of the logged in user. If not matching returns an Unautorized 401 error.

#### `DELETE 'http[s]://<HOST>robots/<id>'`

- Deletes the robot object for the passed id
- Request Arguments: `id:string` the uuid of the robot
- Query Arguments: `hard` (default false) if set to true and the user role is `admin` performs a hard data delete with cascade on the robot wich includes all readings data.
- Usage example: `http[s]://<host>robots/8f6df43a-8699-4cca-97f4-d0f66dc49291`
- Returns: A JSON object with a key, `data`, containg the delete user object id, and a `success` boolean key.
- Permissions: Requires a role of `admin` or `user` and a permission of `delete:user`. If the role is `user` the API compares the id of the robot's owner to the id of the logged in user. If not matching returns an Unautorized 401 error. Additionally, if the user role is `user` the flag is disregarded and a soft delete is performed (robot status is set to `deleted`)
  
```json
{
  "data": "8f6df43a-8699-4cca-97f4-d0f66dc49291",
  "success": true
}
```

---

#### `GET 'http[s]://<HOST>robots/<id>/readings'`

- Fetches the readings for the passed robot id
- Request Arguments: `id:string` the uuid of the robot
- Query Arguments: None
  - `page`: optional, defaults to 1  
  - `per_page`: optional, defaults to 50
  - `start_date`: optional, defaults to None
  - `end_date`: optional, defaults to dateime.now()
- Usage example: `http[s]://<host>robots/8f6df43a-8699-4cca-97f4-d0f66dc49291/readings?page=1&per_page=300&start_date=1 Apr 2024 00:00:00 UTC&end_date=1 May 2024 23:59:59 GMT`
- Returns: A JSON object with:
  - a key `data`, containg an array or readings,
  - a boolean key `has_next` to inform if there are additional pages,
  - a boolean key `has_prev` to inform if there are previous pages,
  - an integer key `page` holding the index of the current page displayed
  - an integer key `pages` holding the total number of pages,
  - an integer key `per_page` holding the number of items per page
  - an integer key `total` holding the total number of items matching the query,
  - and a `success` boolean key.

  ```json
  {
    "data": [
      {
        "date": "Tue, 02 Apr 2024 03:55:37 GMT",
        "readings": [
          { "sensor1": 486 },
          { "sensor2": 0.33 }
        ]
      },
      ...
    ],
    "has_next": false,
    "has_prev": false,
    "page": 1,
    "pages": 1,
    "per_page": 300,
    "success": true,
    "total": 61
  }
  ```

- Permissions: Requires a role of `admin` or `user` and a permission of `get:robot`. If the role is `user` the API compares the id of the robot's owner to the id of the logged in user. If not matching returns an Unautorized 401 error.

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
