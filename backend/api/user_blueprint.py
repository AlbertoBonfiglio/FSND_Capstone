import secrets
import sys
from flask import Blueprint, request, jsonify, g
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
from api.enums import Status
from auth.auth import requires_auth, requires_ownership, requires_permissions
from database.connection import db
from database.models.user import User
from api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error
'''
  An Admin can perform all functions
  An User can perform all functions on data he/she owns
    cannot query all 
    cannot hard delete
'''

def is_it_true(value):
  return value.lower() == 'true'

endpoint = 'users'
user_api = Blueprint(f'{endpoint}', __name__)

@user_api.route(f'/{endpoint}', methods=['GET'])
@cross_origin()
@requires_auth(
  requires_permissions(["get:users"])
)
def get_all():
  try:
    qry = User.query.order_by(User.name.asc())
    
    if request.args.get('activeOnly', True, type=is_it_true):
      qry.filter(User.status == Status.active) 
    
    result = qry.all()
    
    # formats the data for output
    expanded = request.args.get('expanded', False, type=is_it_true)  # type: ignore
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


@user_api.route(f'/{endpoint}/<string:id>', methods=['GET'])
@cross_origin()
@requires_auth( 
  requires_permissions(["get:user"]),
  requires_ownership
)
def get_one(id):
  try:
    record: User = User.query.get(id)
    if (record is None):
        return not_found(f'User # {id} not found.')
     
    if request.args.get('expanded', False, type=is_it_true):
      return jsonify({
          'success': True,
          'data': record.format_long()
      })
    else:
      return jsonify({
          'success': True,
          'data': record.format()
      })
      
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@user_api.route(f'/{endpoint}', methods=['POST'])
@cross_origin()
@requires_auth(
  requires_permissions(["post:user"]),
  requires_ownership
  )
def create_item():
  try:
    body = request.get_json()
    auth_id = body.get('auth_id', '').strip()
    # if it's not an admin posting we don' trust the auth_id passed
    if g.isAdmin == False:
      auth_id = g.userAuthId
    
    record: User = User(
        auth_id = auth_id,
        name = body.get('name', '').strip(),
        # TODO [X] generate an api key for the robots to use
        api_key= secrets.token_urlsafe(24),
        email = body.get('email', '').strip(),
        preferences = body.get('preferences', {})
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


@user_api.route(f'/{endpoint}/<string:id>', methods=['PATCH'])
@cross_origin()
@requires_auth( 
  requires_permissions(["patch:user"]), 
  requires_ownership)
def patch_item(id):
  try:

    instance = User.query.filter(User.id==id)
    data = request.get_json()
    
    #sanitize 
    data.pop("id", None)
    data.pop("auth_id", None)
    data.pop("api_key", None)
    data.pop("robots", None)

    instance.update(data)
    db.session.commit()
    record = instance.first()
    return jsonify({
        'success': True,
        'data': record.format()
    })
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@user_api.route(f'/{endpoint}/<string:id>/changeApiKey', methods=['PATCH'])
@cross_origin()
@requires_auth(
    requires_permissions(["patch:user"]),
    requires_ownership)
def change_api_key(id):
  try:
    instance: User = User.query.filter(User.id == id).first()
    instance.api_key = secrets.token_urlsafe(16)

    db.session.commit()
    
    return jsonify({
        'success': True,
        'data': instance.format()
    })
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@user_api.route(f'/{endpoint}/<string:id>', methods=['DELETE'])
@cross_origin()
@requires_auth( 
  requires_permissions(["delete:user"]), 
  requires_ownership
  )
def delete_item(id):
  # by default all deletions are soft. Only an admin can hard delete a record
  try:
    instance: User = User.query.filter(User.id == id).first()
    if (instance == None):
      return not_found(f'User # {id} not found.')
    
    # Only admin can hard delete
    hardDelete = (request.args.get('hard', False, type=is_it_true) and g.isAdmin)
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