import sys
from flask import Blueprint, Response, request, jsonify
from flask_cors import cross_origin
from database.models.user import User
from database.models.reading import Reading
from api.error_handlers import internal_error, not_found

endpoint = 'readings'
reading_api = Blueprint(f'{endpoint}', __name__)

@reading_api.route(f'/{endpoint}', methods=['GET'])
@cross_origin()
def get_all():
	''' Get all '''
	try:
		qry = Reading.query.order_by(Reading.date.asc())
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


@reading_api.route(f'/{endpoint}/<string:id>', methods=['GET'])
@cross_origin()
def get_one(id=str):
    try:
        record: Reading = Reading.query.get(id)
        if (record is None):
            return not_found(f'Reading # {id} not found.')

        return jsonify({
            'success': True,
            'data': record.format()
        })
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)


@reading_api.route(f'/{endpoint}', methods=['POST'])
@cross_origin()
def create_item():
    try:
        raise NotImplementedError
        
    except Exception as err:
        print(sys.exc_info(), err)
        return internal_error(err)


@reading_api.route(f'/{endpoint}/<string:id>', methods=['PATCH'])
@cross_origin()
def patch_item(id=str):
    raise NotImplementedError

@reading_api.route(f'/{endpoint}/<string:id>', methods=['DELETE'])
@cross_origin()
def delete_item(id=str):
    raise NotImplementedError
