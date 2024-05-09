from functools import wraps
from typing import Final, Literal
from flask import abort, request
from werkzeug.exceptions import NotFound
from backend.auth.auth import AuthError
from backend.database.models.robot import Robot
from backend.database.models.user import User

API_KEY_HEADER: Final[str] = 'XApplicationKey'


'''
  This decorator checks a valid apikey is submitted and that the robot 
  for which the data is sent or requested belongs to the user whose apikey is being used
'''
def requires_api_key(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("[requires_api key] executing")
        try:
            if API_KEY_HEADER not in request.headers:
                raise AuthError({
                    'code': 'missing_header',
                    'description': 'Application Key header cannot be empty.'
                }, 401)
            
            # checks the api key is a valid one
            api_key = request.headers[API_KEY_HEADER]
            user: User = User.query \
              .filter(User.api_key == api_key) \
              .first_or_404('Invalid or expired api key')
                
            # checks the robot belongs to the user whose apikey is being used      
            body = request.get_json()
            mac = body.get("mac", 'not found').strip()

            robot = Robot.query \
              .filter(Robot.mac == mac) \
              .filter(Robot.user_id == user.id) \
              .first_or_404('Invalid MAC address')  
                 
        except AuthError as err:
            print(err)  # for console debugging
            abort(err.status_code)         
                 
        except NotFound as err: 
            print(err)  # for console debugging
            abort(err.code)
            
        except Exception as err:
            # In case something else unpredicted occurs return 500 Internal Server Error
            print(err)  # for console debugging
            abort(500)

        return func(robot, *args, **kwargs)

    return wrapper
