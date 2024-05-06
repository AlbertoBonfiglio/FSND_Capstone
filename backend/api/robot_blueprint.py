import sys
from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
from backend.api.enums import Status
from backend.auth.auth import requires_auth, requires_ownership, requires_permissions, requires_token
from backend.database.models.user import User
from backend.database.models.robot import Robot
from backend.api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error

def is_it_true(value):
  return value.lower() == 'true'

endpoint = 'robots'
robot_api = Blueprint(f'{endpoint}', __name__)

@robot_api.route(f'/{endpoint}', methods=['GET'])
@cross_origin()
@requires_auth(
    #requires_token, 
    requires_permissions(["get:all"]))
def get_all():
    try:
        qry = Robot.query.order_by(Robot.name.asc())
        
        if request.args.get('activeOnly', True, type=is_it_true):
            qry.filter(Robot.status == Status.active) 
        
        result = qry.all()
        # formats the data for output
        expanded = request.args.get(
            'expanded', False, type=is_it_true)  # type: ignore
        if expanded:
            formattedData = [datum.format_long() for datum in result]
        else:
            formattedData = [datum.format() for datum in result]

        return jsonify({
            'success': True,
            'data': formattedData,
            'count': len(formattedData)
        })
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)


@robot_api.route(f'/{endpoint}/<string:id>', methods=['GET'])
@cross_origin()
@requires_auth(
    #requires_token, 
    requires_permissions(["get:single", "get:all"]),
    requires_ownership
)
def get_one(id: str):
    try:
        record: Robot = Robot.query.get(id)
        if (record is None):
            return not_found(f'Robot # {id} not found.')

        return jsonify({
            'success': True,
            'data': record.format()
        })
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)


@robot_api.route(f'/{endpoint}', methods=['POST'])
@cross_origin()
@requires_auth(
    #requires_token,
    requires_permissions(["post:single", "post:all"]),
    requires_ownership
    )
def create_item():
    try:

        body = request.get_json()

        # verify the userId is valid (probably not needed as enforced by db)   
        userId = body.get('userId', '').strip()
        user: User = User.query.get(userId)
        if (user is None):
            return not_found(f'User: [{userId}] not found.')

        record: Robot = Robot(
            userId=userId,
            name=body.get('name', '').strip(),
            mac=body.get('mac', '').strip(),
            preferences=body.get('preferences', {}),
            status=body.get("status", Status.active.value),
        )
        record.insert()

        return jsonify({
            'success': True,
            'data': record.format()
        })
    except ValueError as err:
        print(sys.exc_info(), err)
        return unprocessable_error(err)

    except IntegrityError as err:
        print(sys.exc_info(), err)
        return integrity_error(err)
    
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)


@robot_api.route(f'/{endpoint}/<string:id>', methods=['PATCH'])
@cross_origin()
def patch_item(id=str):
    raise NotImplementedError

@robot_api.route(f'/{endpoint}/<string:id>', methods=['DELETE'])
@cross_origin()
def delete_item(id=str):
    raise NotImplementedError
