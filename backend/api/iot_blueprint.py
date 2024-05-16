import sys
from flask import Blueprint, jsonify, request
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError

from api.error_handlers import integrity_error, internal_error, not_found, unprocessable_error
from auth.api_key import requires_api_key
from database.models.reading import Reading
from database.models.robot import Robot
import datetime as dt

endpoint = 'iot'
iot_api = Blueprint(f'{endpoint}', __name__)


@iot_api.route(f'/{endpoint}/<string:MAC>/getRobotSettings', methods=['GET'])
@cross_origin()
@requires_api_key
def get_robotConfiguration(robot:Robot, MAC:str):
  try:
    
    return jsonify({
        'success': True,
        'data': robot.preferences,
    })
  except Exception as err:
      print(sys.exc_info(), err)
      return internal_error(err)


@iot_api.route(f'/{endpoint}/<string:MAC>/postSensorReadings', methods=['POST'])
@cross_origin()
@requires_api_key
def post_sensor_readings(robot: Robot, MAC: str):
  try:
    body = request.get_json()
    
    reading : Reading = Reading(
      robot_id = robot.id,
      data= body.get("data", {}),
      date=body.get("date", dt.datetime.now()),
    )
    reading.insert()

    return jsonify({
        'success': True
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
