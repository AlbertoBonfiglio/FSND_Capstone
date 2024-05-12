# Schema

The backend of the 

## User with json preferences
  
- Name
- AuthId
- Robots
  
## Robot

  with json preferences

- owner
-
- mac address
- name
- model
- roam distance
- roam frequency
- onboard sensors
- data collection frequency

## Data

this is unstructured data so ccould be just stored as json

- datetime
- robot
- data array

## API

- Should allow robots to get their configuration
- Should allow robots to upload sensor data
- Should be secured by an API key for robots and a JWT token for users (maybe use google firebase for auth and app security?)

### Endpoints

#### Users

#### Robots
