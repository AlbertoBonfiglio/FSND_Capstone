import sys
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError

from backend.api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error
from backend.auth.api_key import requires_api_key
from backend.database.models.reading import Reading
from backend.database.models.robot import Robot

endpoint = 'iot'
iot_api = Blueprint(f'{endpoint}', __name__)


@iot_api.route(f'/{endpoint}/getRobotSettings', methods=['POST'])
@cross_origin()
@requires_api_key
def get_robotConfiguration(robot: Robot):
  try:
    
    return jsonify({
        'success': True,
        'data': robot.preferences,
    })
  except Exception as err:
      print(sys.exc_info(), err)
      return internal_error(err)



@iot_api.route(f'/{endpoint}/postSensorReadings', methods=['POST'])
@cross_origin()
@requires_api_key
def post_sensor_readings(robot):
  try:
    body = request.get_json()
    
    reading : Reading = Reading(
      robot_id=robot.id,
      data= body.get("data", {}),
    )
    reading.insert()

    return jsonify({
        'success': True,
        'data': reading.format()
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
