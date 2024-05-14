import sys
from flask import Blueprint, request, jsonify, g
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
import datetime as dt
from api.enums import Status
from auth.auth import requires_auth, requires_ownership, requires_permissions
from database.connection import db
from database.models.reading import Reading
from database.models.robot import Robot
from api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error

def is_it_true(value):
  return value.lower() == 'true' or value == True

def is_it_integer(value: str):
    if value.isdigit() :
        return int(value)
    else:
        raise ValueError(f'{value} is not an integer')
    
def is_it_datetime(value: str):
    try:
        '1 May 2024 01:02:26 GMT'
        parsed = dt.datetime.strptime(value, '%d %b %Y %H:%M:%S %Z')
        return parsed 
    except Exception as err:
        print(sys.exc_info(), err)
        return ValueError(f'Error processing {value}')
        
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
        
        query = Reading.query \
            .filter(Robot.id == id)\
            .order_by(Reading.date)
            
        # TODO [X] Add date-range
        start_date = request.args.get('start_date', None, type=is_it_datetime)
        end_date = request.args.get('end_date', dt.datetime.now(), type=is_it_datetime)
        
        if (start_date != None):
            query = query.filter(Reading.date >= start_date)
            
        if (end_date != None):          
            query = query.filter(Reading.date <= end_date)    
        
        # TODO [X] Add pagination
        page = request.args.get('page', 1, type=is_it_integer)
        per_page = request.args.get('per_page', 50, type=is_it_integer)
        readings = query.paginate(page=page, per_page=per_page, max_per_page=None, error_out=False, count=True)
        if (readings.total > 0 and readings.pages < page):
            return not_found(f'Exceeded pagination limit: page {page} of {readings.pages} ')
        
        formattedReadings = [datum.format_short() for datum in readings]
        
        return jsonify({
            'success': True,
            'data': formattedReadings,
            'page': readings.page,
            'per_page': readings.per_page,
            'pages': readings.pages,
            'has_next': readings.has_next,
            'has_prev': readings.has_prev,
            'total': readings.total
        })
        
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)
