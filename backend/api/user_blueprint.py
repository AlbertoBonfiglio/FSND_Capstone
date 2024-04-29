import sys
from flask import Blueprint, Response, request, jsonify
from flask_cors import cross_origin
from backend.database.models.user import User
from backend.api.error_handlers import internal_error, not_found

endpoint = 'users'
user_api = Blueprint(f'{endpoint}', __name__)

@user_api.route(f'/{endpoint}', methods=['GET'])
@cross_origin()
def get_all():
  try:
    qry = User.query.order_by(User.name.asc())
    result = qry.all()
    # formats the data for output
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
def get_one(id = str):
  try:
    record: User = User.query.get(id)
    if (record is None):
        return not_found(f'User # {id} not found.')
      
    return jsonify({
        'success': True,
        'data': record.format()
    })
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@user_api.route(f'/{endpoint}', methods=['POST'])
@cross_origin()
def create_item():
  try:
    
    body = request.get_json()
    
    record: User = User(
        authId=body.get('authId', '').strip(),
        name=body.get('name', '').strip()
    )
    record.insert()
    
    return jsonify({
        'success': True,
        'data': record.format()
    })
  except Exception as err:
    print(sys.exc_info(), err)
    return internal_error(err)


@user_api.route(f'/{endpoint}/<string:id>', methods=['PATCH'])
@cross_origin()
def patch_item(id=str):
  raise NotImplementedError

@user_api.route(f'/{endpoint}/<string:id>', methods=['DELETE'])
@cross_origin()
def delete_item(id=str):
  raise NotImplementedError
