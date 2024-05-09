import sys
from flask import Blueprint, request, jsonify, g
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
from backend.api.enums import Status
from backend.auth.auth import requires_auth, requires_ownership, requires_permissions
from backend.database.connection import db
from backend.database.models.reading import Reading
from backend.database.models.user import User
from backend.database.models.robot import Robot
from backend.api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error

def is_it_true(value):
  return value.lower() == 'true' or value == True

endpoint = 'robots'
robot_api = Blueprint(f'{endpoint}', __name__)

@robot_api.route(f'/{endpoint}/<string:id>', methods=['GET'])
@cross_origin()
@requires_auth(
    requires_permissions(["get:robots"]),
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
    requires_permissions(["post:robot"]),
    requires_ownership
    )
def create_item():
    try:
        body = request.get_json()

        # verify the userId is valid (probably not needed as enforced by db)   
        user_id = body.get('user_id', '').strip()
        #user: User = User.query.get(user_id)
        #if (user is None):
        #    return not_found(f'User: [{user_id}] not found.')

        record: Robot = Robot(
            user_id=user_id,
            name=body.get('name', '').strip(),
            mac=body.get('mac', '').strip(),
            description=body.get('description', '').strip(),
            preferences=body.get('preferences', {}),
            #status=body.get("status", Status.active),
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
@requires_auth(
    requires_permissions(["patch:robot"]),
    requires_ownership
)
def patch_item(id):
    try:
        instance = Robot.query.filter(Robot.id == id)
        if (instance == None):
            return not_found(f'Robot # {id} not found.')
      
        data = request.get_json()

        # sanitize
        data.pop("id", None)
        data.pop("user_id", None)
        data.pop("readings", None)
  
        # update with the sanitized json    
        instance.update(data)
        db.session.commit()
     
        # refresh   
        record = instance.first()
        return jsonify({
            'success': True,
            'data': record.format()
        })
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)



@robot_api.route(f'/{endpoint}/<string:id>', methods=['DELETE'])
@cross_origin()
@requires_auth(
    requires_permissions(["delete:robot"]),
    requires_ownership
)
def delete_item(id):
    # by default all deletions are soft. Only an admin can hard delete a record
  try:
    instance: Robot = Robot.query.get(id)
    if (instance == None):
      return not_found(f'Robot # {id} not found.')

    # Only admin can hard delete
    hardDelete = (request.args.get(
        'hard', False, type=is_it_true) and g.isAdmin)
    if hardDelete:
      instance.delete()
    else:
      instance.status = Status.deleted.value
      db.session.commit()

    return jsonify({
        'success': True,
        'data': id
    })
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@robot_api.route(f'/{endpoint}/<string:id>/readings', methods=['GET'])
@cross_origin()
@requires_auth(
    requires_permissions(["get:robots", "get:readings"]),
    requires_ownership
)
def get_readings(id: str):
    try:
        record: Robot = Robot.query.get(id)
        if (record is None):
            return not_found(f'Robot # {id} not found.')
        # TODO [ ] Add filters such as date-range
        readings = Reading.query.filter(Robot.id == id).all() 
        formattedReadings = [datum.format() for datum in readings]
        
        return jsonify({
            'success': True,
            'data': formattedReadings
        })
        
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)
