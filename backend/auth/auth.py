from enum import Enum
from functools import wraps
import json
from flask import Response, request, abort, g
from jose import jwt
from urllib.request import urlopen
from database.models.robot import Robot
from database.models.user import User
from utils import isNoneOrEmpty
from flask import request
from config import Config
'''
    The Auth module exposes flask decorators that are responsible for 
    authentication and authorization 
    
    Basically every call will need an Auth0 token
    There are 3 types of users:
    Admins that can see and modify any data belonging to any user
    Users that can see and modify any data belonging to them 
    Robots that can only request settings for their operation and post data  
     Robots use an api key from the user to gain access to the endpoints
'''

config = Config;

class tokenType(Enum):
    bearer = 0
    auth = 1

# AuthError Exception
'''
AuthError Exception
A standardized way to communicate auth failure modes
'''
class AuthError(Exception):
    def __init__(self, code, error, description):
        self.error = error
        self.code = code
        self.description = description

    def serialize(self):
        return {
            'code': self.code,
            'error': self.error,
            'description': self.description,
        }

# Auth Header
'''
    #TODO [X] implement get_token_auth_header() method
    [X] it should attempt to get the header from the request
    [X] it should raise an AuthError if no header is present
            10.4.1 400 Bad Request The request could not be understood 
            by the server due to malformed syntax. The client SHOULD NOT 
            repeat the request without modifications.
    [X] it should attempt to split bearer and the token
    [X] it should raise an AuthError if the header is malformed
    [X] return the token part of the header
'''
def get_token_auth_header():
    # check if authorization is not in request
    if 'Authorization' not in request.headers:
        raise AuthError(401, 'missing_header', 'Authorization header cannot be empty.')

    # get the token
    auth_header = request.headers['Authorization']
    header_parts = auth_header.split(' ')

    # check if token is valid
    if len(header_parts) != 2:
        raise AuthError(400, 'malformed_token','Authorization token is malformed.')
  
    elif header_parts[tokenType.bearer.value].lower() != 'bearer':
        raise AuthError(400, 'missing_token','Bearer token is malformed or empty.')

    return header_parts[tokenType.auth.value]


'''
    #TODO [X] implement get_token_rsa_key(header) method
    @INPUTS
        header: the request's authorization header (string)

    [X] it should be an Auth0 token with key id (kid)
    [X] it should verify the token using Auth0 /.well-known/jwks.json
    [X] return the rsa key

    !!NOTE urlopen has a common certificate error described here: 
    https://stackoverflow.com/questions/50236117/scraping-ssl-certificate-verify-failed-error-for-http-en-wikipedia-org
'''
def get_token_rsa_key(header):
    rsaKey = {}
    if 'kid' not in header:
        raise AuthError(400, 'invalid_header', 'Authorization header is malformed (missing kid).')
    try:
        jsonUrl = urlopen(
            f'https://{config.auth0_domain}/.well-known/jwks.json')
        public_keys = json.loads(jsonUrl.read())

        for key in public_keys['keys']:
            if key['kid'] == header['kid']:
                rsaKey = {
                    'kty': key['kty'],
                    'kid': key['kid'],
                    'use': key['use'],
                    'n': key['n'],
                    'e': key['e']
                }
        if rsaKey == {}:
            # if for some reason we can;t get a valid key return 422 Unprocessable
            raise AuthError(422, 'invalid_header', 'Unable to retrieve decoding key.')

    except Exception as err:
        # In case something else wen't sideways return a BAD Request 400
        raise AuthError(400, 'invalid_header', f'Authorization malformed. {err}')

    return rsaKey


'''
    #TODO [X] implement verify_decode_jwt(token) method
    @INPUTS
        token: a json web token (string)

    [X] it should be an Auth0 token with key id (kid)
    [X] it should verify the token using Auth0 /.well-known/jwks.json
    [X] it should decode the payload from the token
    [X] it should validate the claims
    [X] return the decoded payload

    !!NOTE urlopen has a common certificate error described here: 
    https://stackoverflow.com/questions/50236117/scraping-ssl-certificate-verify-failed-error-for-http-en-wikipedia-org
'''
def verify_decode_jwt(token=''):
    if isNoneOrEmpty(token):
        raise AuthError(400, 'invalid_token', 'Token cannot be empty.')
 
    try:
        # Get the token header data
        header = jwt.get_unverified_header(token)

        # Make sure a Key is present in the header
        rsaKey = get_token_rsa_key(header)
        if rsaKey:
            # makes sure the claims are retrieved
            options = {"require": ["exp", "iss", "sub"]}
            # USE THE KEY TO VALIDATE THE JWT
            payload = jwt.decode(
                token,
                rsaKey,
                algorithms=config.auth0_algorithms,
                audience=config.auth0_audience,
                issuer=f'https://{config.auth0_domain}/',
                options=options
            )
            return payload

    except jwt.ExpiredSignatureError as err:
        print(f'verify_decode_jwt ExpiredSignatureError -- {err}')
        raise AuthError(401 , 'token_expired', 'Token signature expired.')

    except jwt.JWTClaimsError:
        print(f'verify_decode_jwt JWTClaimsError: -- {err}')
        raise AuthError(401, 'invalid_claims', 'Incorrect claims. Please, check the audience and issuer.')

    except Exception as err:
        print(f'verify_decode_jwt Generic: -- {err}')
        # If it's not a token expiration or  claims issue, we return an  unprocessable (422)  status
        raise AuthError(422, 'invalid_header', f'Unable to parse authentication token. {err}')


'''
    #TODO [X] implement check_permissions(permission, payload) method
    @INPUTS
        permission: array of string permission (i.e. ['post:drink'])
        payload: decoded jwt payload

    [X] it should raise an AuthError if permissions are not included in the payload
        !!NOTE check your RBAC settings in Auth0
    [X] it should raise an AuthError if the requested permission string is not 
        in the payload permissions array
    [X] return true otherwise
'''
def check_permissions(permissions = [], payload = [], roles = []):
    try:
        if (len(permissions) == 0) or \
            any(item in payload for item in permissions):
            return True
        
        raise AuthError(403, 'Forbidden', 'Permissions needed for operations are not supplied.')

    except KeyError as err:
        raise AuthError(401, 'invalid_token', 'Authorization token is missing the permissions array.')


''' 
    Checks the user role is admin
'''
def check_admin_permissions(payload=[]):
    roles = ['admin']
    return any(item in payload for item in roles)


'''
    decorator used internally to require a token and pass it to the following decorators
'''
def _requires_token(func):
    ''' Makes sure a valid token has been submitted'''
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("[requires_token] executing")
        try:    
            token = get_token_auth_header()
            payload = verify_decode_jwt(token)
            kwargs['token_payload'] = payload
        except AuthError as err:
            print(err)  # for console debugging
            response = Response(
                status=err.code, 
                mimetype="application/json", 
                response=json.dumps(err.serialize())
            )
            abort(response)

        except Exception as err:
            # In case something else unpredicted occurs return 500 Internal Server Error
            response = Response(
               status=500,
               mimetype="application/json",
               response= json.dumps({
                   'code': 500,
                   'error': 'Internal Server Error'
               }) 
            )
            abort(response)

        return func(*args, **kwargs)
    return wrapper
    

''' 
    Makes sure the user submitting the request is authorized to perform the operation
    if the user is an admin is by default authorized
        
    if the user is not an admin it can only perform operation on his/her own
    data 
    * Post and patch and delete are the only methods needed 
    * for user endpoints we will check the id passed in the request url
    * for the other endpoints (robots and records) the user_id in the payload 
        will need to be checked
    The flow is: 
        get the user based on the token id
        if method is DELETE 
            check that 
                the user matches the id argument and 
                change the hard_delete flag to false
        if Post or patch 
            if endpoint is user check auth_id matches the token id  
            if endpoint is robot check user_id matches the user retrieved via the token
            if endpoint is data check the oener of the robot id passed matches the user retrieved via the token 
'''
def requires_ownership(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("[requires_ownership] executing.")
        g.userAuthId = None
        g.isAdmin = False
        g.isOwner = False
        try:
            payload = kwargs.get('token_payload')
            g.isAdmin = check_admin_permissions(payload["user_profile"]["roles"])
            
            if (g.isAdmin == False):
                g.userAuthId = payload["sub"] # gets the authId from the token payload
                
                match request.blueprint.lower():
                    case "users": # used for POST, GET, PATCH, DELETE  
                        if request.method.upper() == 'POST':
                            if ( g.userAuthId.lower() != request.get_json().get("auth_id", "").lower()):
                                raise AuthError(401, 'Unauthorized', 'Unauthorized operation. Requires ownership')

                        else:    
                            user: User = User.query.get(request.view_args['id'])
                            if (user == None):
                                raise AuthError(404, 'Not Found', 'Authorization User not found.')
                            if (user.auth_id.lower() != g.userAuthId.lower()):
                                raise AuthError(401, 'Unauthorized', 'Unauthorized operation. Requires ownership')
                            
                    case "robots":  # used for POST GET, PATCH, DELETE
                        if request.method.upper() == 'POST':
                            # does not have a robot id so look at the request body for owner_id
                            user: User = User.query.get(request.get_json().get("user_id"))
                            if (user == None): 
                                raise AuthError(404, 'Not Found', 'Authorization User not found.')
                            if (user.auth_id.lower() != g.userAuthId.lower()):
                                raise AuthError(401, 'Unauthorized', 'Unauthorized operation. Requires ownership')
                
                        else: # all other methods 
                            robot = Robot.query.get(request.view_args['id'])
                            if ((robot == None) or (robot.user.auth_id.lower() != g.userAuthId.lower())):
                                raise AuthError(401, 'Unauthorized', 'Unauthorized operation. Requires ownership')
                
                    case _:
                        raise Exception("Blueprint not found")                    
                
                g.isOwner = True

        except AuthError as err:
            response = Response(
                status=err.code,
                mimetype="application/json",
                response=json.dumps(err.serialize())
            )
            abort(response)
                        
        except Exception as err:
            print(err)  # for console debugging
            response = Response(
                status=500,
                mimetype="application/json",
                response=json.dumps({
                    'code': 500,
                    'error': 'Internal Server Error'
                })
            )
            abort(response)
        return func(*args, **kwargs)
    return wrapper


def requires_permissions(permissions = []):
    ''' Check permissions '''
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print("[requires_permissions] executing")
            try:
                payload = kwargs.get('token_payload', None)
                check_permissions(
                    permissions, payload["user_profile"]["permissions"])
       
            except AuthError as err:
                print(err)  # for console debugging
                response = Response(
                    status=err.code,
                    mimetype="application/json",
                    response=json.dumps(err.serialize())
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
                        'error': 'Internal Server Error'
                    })
                )
                abort(response)

            return func(*args, **kwargs)

        return wrapper
    return decorator


def requires_roles(roles= []):
    ''' Check permissions '''
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            print("[requires_roles] executing")
            try:
                payload = kwargs.get('token_payload', None)
                if any(item in payload["tankrover_api/roles"] for item in roles) == False:
                       # Special case: to hard delete the delete:all permission is needed (admins only)
                     raise AuthError("Not Authorized. Missing role.", 400)

            except AuthError as err:
                print(err)  # for console debugging
                response = Response(
                    status=err.code,
                    mimetype="application/json",
                    response=json.dumps(err.serialize())
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
                        'error': 'Internal Server Error'
                    })
                )
                abort(response)

            return func(*args, **kwargs)

        return wrapper
    return decorator


''' 
    Checks if the user is part of the admin roles.
'''
def requires_admin_role(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("[requires_admin] executing")
        try:
            payload = kwargs.get('token_payload', None)
            is_admin = check_admin_permissions(payload["tankrover_api/roles"])
        except Exception as err:
            # In case something else unpredicted occurs return 500 Internal Server Error
            print(err)  # for console debugging
            response = Response(
                status=500,
                mimetype="application/json",
                response=json.dumps({
                    'code': 500,
                    'error': 'Internal Server Error'
                })
            )
            abort(response)

        return func(*args, **kwargs)

    return wrapper
    

'''
    clears the token from the args
    it's the last function executed 
'''
def _clear_token(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        print("[clear_token] executing")
        kwargs.pop('token_payload', None)
        return func(*args, **kwargs)
    return wrapper


'''
    Combines all the auth decorators into one function
'''
def requires_auth(*decorators):  
    def composed_decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            composition = _clear_token(func) ## adds the clear token function first to be executed last
            for decorator in reversed(decorators): ## adds the decorators in reverse order   
                composition = decorator(composition)
            composition = _requires_token(composition) ## adds the token to the kwargs to be used in the inner decorators     
            return composition(*args, **kwargs)
        return wrapper
    return composed_decorator