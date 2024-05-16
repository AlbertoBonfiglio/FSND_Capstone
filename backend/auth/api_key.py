from functools import wraps
import json
from typing import Final
from flask import Response, abort, request
from werkzeug.exceptions import NotFound
from auth.auth import AuthError
from database.models.robot import Robot
from database.models.user import User

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
                raise AuthError(401, 'missing_header','Application Key header cannot be empty.')
            
            # checks the api key is a valid one
            api_key = request.headers[API_KEY_HEADER]
            user: User = User.query \
                .filter(User.api_key == api_key) \
                .first()
            if (user == None): 
                raise AuthError(401, 'Unauthorized', 'Invalid or expired API key')    
                
            # checks the robot belongs to the user whose apikey is being used      
            robot = Robot.query \
                .filter(Robot.mac == request.view_args["MAC"]) \
                .filter(Robot.user_id == user.id) \
                .first_or_404('MAC address or user not found for API key')  
                 
        except AuthError as err:
            print(err)  # for console debugging
            response = Response(
                status=err.code,
                mimetype="application/json",
                response=json.dumps(err.serialize())
            )
            abort(response)
                 
        except NotFound as err: 
            print(err)  # for console debugging
            response = Response(
                status=err.code,
                mimetype="application/json",
                response=json.dumps({
                    'code': err.code,
                    'error': err.name,
                    'description': err.description
                })
            )
            abort(response)
            
        except Exception as err:
            # In case something else unpredicted occurs return 500 Internal Server Error
            print(err)  # for console debugging
            response = Response(
                status=500,
                mimetype="application/json",
                response=json.dumps({
                    'code': 500,
                    'error': 'Internal Server Error',
                    'description': ''
                })
            )
            abort(response)

        return func(robot, *args, **kwargs)

    return wrapper
